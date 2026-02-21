// ===== FILE: routes/examRoutes.js =====
import express from "express";
import {
    createExam,
    getAllExams,
    getExamById,
    updateExam,
    deleteExam,
    submitAnswer,
    getStudentAnswers,
    getExamSubmissions
} from "../controllers/ExamController.js";

const router = express.Router();

// ===== EXAM ROUTES =====

// Create new exam
router.post('/exams', createExam);

// Get all exams
router.get('/exams', getAllExams);

// Get exam by ID (with questions and options)
router.get('/exams/:id', getExamById);

// Update exam
router.put('/exams/:id', updateExam);

// Delete exam
router.delete('/exams/:id', deleteExam);

// Submit student answer
router.post('/exams/:id/submit', submitAnswer);

// Get student answers for specific exam
router.get('/exams/:examId/students/:studentId/answers', getStudentAnswers);

// Get all submissions for an exam
router.get('/exams/:id/submissions', getExamSubmissions);

export default router;