import pool from '../config/db.js'; // sesuaikan path koneksi mysql2 kamu

export async function createExam({ title, description, duration, created_by }) {
    const [r] = await pool.execute(
        'INSERT INTO exams (title, description, duration, created_by) VALUES (?, ?, ?, ?)',
        [title, description, duration ?? 30, created_by]
    );
    return r.insertId;
}

export async function createQuestions(examId, questions) {
    for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await pool.execute(
            'INSERT INTO questions (exam_id, type, question, options, required, sort_order) VALUES (?, ?, ?, ?, ?, ?)',
            [examId, q.type, q.question, q.options ? JSON.stringify(q.options) : null, q.required ? 1 : 0, i]
        );
    }
}

export async function getActiveExams() {
    const [rows] = await pool.execute(
        'SELECT id, title, description, duration, created_at FROM exams WHERE is_active = 1 ORDER BY created_at DESC'
    );
    return rows;
}

export async function getExamWithQuestions(examId) {
    const [[exam]] = await pool.execute(
        'SELECT * FROM exams WHERE id = ? AND is_active = 1', [examId]
    );
    if (!exam) return null;

    const [questions] = await pool.execute(
        'SELECT * FROM questions WHERE exam_id = ? ORDER BY sort_order', [examId]
    );
    exam.questions = questions.map(q => ({
        ...q,
        options: q.options ? JSON.parse(q.options) : null,
    }));
    return exam;
}

export async function saveAnswers(examId, studentId, answers) {
    for (const { question_id, answer } of answers) {
        await pool.execute(
            `INSERT INTO answers (exam_id, student_id, question_id, answer)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE answer = VALUES(answer)`,
            [examId, studentId, question_id, JSON.stringify(answer)]
        );
    }
    await pool.execute(
        `INSERT IGNORE INTO exam_submissions (exam_id, student_id) VALUES (?, ?)`,
        [examId, studentId]
    );
}

export async function hasSubmitted(examId, studentId) {
    const [[row]] = await pool.execute(
        'SELECT id FROM exam_submissions WHERE exam_id = ? AND student_id = ?',
        [examId, studentId]
    );
    return !!row;
}
// Tambahkan fungsi-fungsi ini ke server/models/Exam.js

export async function getExamResults(examId) {
    // Ambil semua siswa yang sudah submit
    const [submissions] = await pool.execute(`
    SELECT 
      u.id as student_id,
      u.username,
      u.kelas,
      es.submitted_at
    FROM exam_submissions es
    JOIN users u ON u.id = es.student_id
    WHERE es.exam_id = ?
    ORDER BY es.submitted_at ASC
  `, [examId]);

    // Ambil semua soal
    const [questions] = await pool.execute(`
    SELECT id, question, type, sort_order 
    FROM questions 
    WHERE exam_id = ? 
    ORDER BY sort_order
  `, [examId]);

    // Ambil semua jawaban untuk ujian ini
    const [answers] = await pool.execute(`
    SELECT student_id, question_id, answer 
    FROM answers 
    WHERE exam_id = ?
  `, [examId]);

    // Gabungkan data per siswa
    const results = submissions.map(s => {
        const studentAnswers = {};
        answers
            .filter(a => a.student_id === s.student_id)
            .forEach(a => {
                try {
                    studentAnswers[a.question_id] = JSON.parse(a.answer);
                } catch {
                    studentAnswers[a.question_id] = a.answer;
                }
            });

        return {
            student_id: s.student_id,
            username: s.username,
            kelas: s.kelas,
            submitted_at: s.submitted_at,
            answers: studentAnswers,
        };
    });

    return { exam: null, questions, results };
}

export async function getExamById(examId) {
    const [[exam]] = await pool.execute(
        'SELECT * FROM exams WHERE id = ?', [examId]
    );
    return exam || null;
}

export async function getAllExamsWithStats() {
    const [rows] = await pool.execute(`
    SELECT 
      e.id,
      e.title,
      e.description,
      e.duration,
      e.is_active,
      e.created_at,
      u.username as created_by_name,
      COUNT(DISTINCT es.student_id) as total_submissions,
      COUNT(DISTINCT q.id) as total_questions
    FROM exams e
    LEFT JOIN users u ON u.id = e.created_by
    LEFT JOIN exam_submissions es ON es.exam_id = e.id
    LEFT JOIN questions q ON q.exam_id = e.id
    GROUP BY e.id
    ORDER BY e.created_at DESC
  `);
    return rows;
}

export async function toggleExamActive(examId, isActive) {
    await pool.execute(
        'UPDATE exams SET is_active = ? WHERE id = ?',
        [isActive ? 1 : 0, examId]
    );
}