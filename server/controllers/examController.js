import {
    createExam, createQuestions, getActiveExams, getExamWithQuestions,
    saveAnswers, hasSubmitted, getExamResults, getExamById,
    getAllExamsWithStats, toggleExamActive
} from '../models/Exam.js';

/* Guru: POST /api/exams — upload soal */
export async function uploadExam(req, res) {
    try {
        if (req.user.role !== 'guru' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Hanya guru yang bisa upload soal' });
        }
        const { title, description, duration, questions } = req.body;
        if (!title || !questions?.length) {
            return res.status(400).json({ error: 'Judul dan soal wajib diisi' });
        }
        // Otomatis pakai kelas guru yang login
        const kelas_target = req.user.kelas;
        const examId = await createExam({
            title, description, duration,
            created_by: req.user.sub,
            kelas_target
        });
        await createQuestions(examId, questions);
        return res.status(201).json({ success: true, examId, totalQuestions: questions.length });
    } catch (err) {
        console.error('[uploadExam]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/* Siswa: GET /api/exams — daftar ujian aktif */
export async function listExams(req, res) {
    try {
        const kelas = req.user.role === 'siswa' ? req.user.kelas : null;
        const exams = await getActiveExams(kelas);
        return res.json(exams);
    } catch (err) {
        console.error('[listExams]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/* Siswa: GET /api/exams/:id — detail soal */
export async function getExam(req, res) {
    try {
        const exam = await getExamWithQuestions(req.params.id);
        if (!exam) return res.status(404).json({ error: 'Ujian tidak ditemukan' });
        return res.json(exam);
    } catch (err) {
        console.error('[getExam]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/* Siswa: GET /api/exams/:id/status */
export async function getExamStatus(req, res) {
    try {
        const submitted = await hasSubmitted(req.params.id, req.user.sub);
        return res.json({ submitted });
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/* Siswa: POST /api/exams/:id/submit — kumpulkan jawaban */
export async function submitExam(req, res) {
    try {
        const examId = req.params.id;
        const studentId = req.user.sub;
        if (await hasSubmitted(examId, studentId)) {
            return res.status(409).json({ error: 'Kamu sudah mengumpulkan ujian ini' });
        }
        const { answers } = req.body;
        if (!answers?.length) {
            return res.status(400).json({ error: 'Jawaban tidak boleh kosong' });
        }
        await saveAnswers(examId, studentId, answers);
        return res.json({ success: true, message: 'Jawaban berhasil dikumpulkan' });
    } catch (err) {
        console.error('[submitExam]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/* Guru: GET /api/exams/all — semua ujian + statistik */
export async function listAllExams(req, res) {
    try {
        if (req.user.role !== 'guru' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Akses ditolak' });
        }
        const kelas = req.user.role === 'guru' ? req.user.kelas : null;
        const exams = await getAllExamsWithStats(kelas);
        return res.json(exams);
    } catch (err) {
        console.error('[listAllExams]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
/* Guru: GET /api/exams/:id/results — hasil jawaban semua siswa */
export async function getResults(req, res) {
    try {
        if (req.user.role !== 'guru' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Akses ditolak' });
        }
        const exam = await getExamById(req.params.id);
        if (!exam) return res.status(404).json({ error: 'Ujian tidak ditemukan' });

        const data = await getExamResults(req.params.id);
        data.exam = exam;
        return res.json(data);
    } catch (err) {
        console.error('[getResults]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/* Guru: GET /api/exams/:id/export — export CSV */
export async function exportCSV(req, res) {
    try {
        if (req.user.role !== 'guru' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Akses ditolak' });
        }
        const exam = await getExamById(req.params.id);
        if (!exam) return res.status(404).json({ error: 'Ujian tidak ditemukan' });

        const { questions, results } = await getExamResults(req.params.id);

        // Build CSV
        const headers = [
            'No',
            'Username',
            'Kelas',
            'Waktu Submit',
            ...questions.map((q, i) => `Soal ${i + 1}: ${q.question.substring(0, 30)}`)
        ];

        const rows = results.map((r, i) => [
            i + 1,
            r.username,
            r.kelas || '-',
            new Date(r.submitted_at).toLocaleString('id-ID'),
            ...questions.map(q => {
                const ans = r.answers[q.id];
                if (!ans) return '-';
                if (Array.isArray(ans)) return ans.join('; ');
                return String(ans);
            })
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const filename = `hasil_${exam.title.replace(/\s+/g, '_')}_${Date.now()}.csv`;
        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        // BOM untuk Excel agar bisa baca UTF-8
        return res.send('\uFEFF' + csvContent);
    } catch (err) {
        console.error('[exportCSV]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/* Guru: PATCH /api/exams/:id/toggle — aktif/nonaktif ujian */
export async function toggleExam(req, res) {
    try {
        if (req.user.role !== 'guru' && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Akses ditolak' });
        }
        const { is_active } = req.body;
        await toggleExamActive(req.params.id, is_active);
        return res.json({ success: true });
    } catch (err) {
        console.error('[toggleExam]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
}