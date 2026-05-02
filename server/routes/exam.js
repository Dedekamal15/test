import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
    uploadExam,
    listExams,
    getExam,
    submitExam,
    getExamStatus,
    listAllExams,
    getResults,
    exportCSV,
    toggleExam,
} from '../controllers/examController.js';

const router = Router();

// ── Guru ──────────────────────────────────────────
router.post('/', requireAuth, uploadExam);               // upload soal
router.get('/all', requireAuth, listAllExams);           // semua ujian + stats
router.get('/:id/results', requireAuth, getResults);     // hasil jawaban siswa
router.get('/:id/export', requireAuth, exportCSV);       // export CSV
router.patch('/:id/toggle', requireAuth, toggleExam);    // aktif/nonaktif

// ── Siswa ─────────────────────────────────────────
router.get('/', requireAuth, listExams);                 // daftar ujian aktif
router.get('/:id/status', requireAuth, getExamStatus);  // cek sudah submit?
router.get('/:id', requireAuth, getExam);               // ambil soal
router.post('/:id/submit', requireAuth, submitExam);    // kumpulkan jawaban

export default router;