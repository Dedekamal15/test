// ===== FILE: controllers/ExamController.js =====
import { Exam, Question, QuestionOption, StudentAnswer } from "../models/ExamModel.js";
import db from "../config/Database.js";

// 1. CREATE EXAM - Buat ujian baru
export const createExam = async (req, res) => {
    const transaction = await db.transaction();
    
    try {
        const { title, description, questions, created_by } = req.body;

        // Validasi input
        if (!title || !questions || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Title dan questions wajib diisi'
            });
        }

        // 1. Create exam
        const exam = await Exam.create({
            title,
            description: description || null,
            created_by: created_by || null
        }, { transaction });

        // 2. Create questions dengan options
        for (let i = 0; i < questions.length; i++) {
            const questionData = questions[i];
            
            const question = await Question.create({
                exam_id: exam.id,
                question_text: questionData.question,
                question_type: questionData.type,
                is_required: questionData.required !== false,
                order_number: i + 1
            }, { transaction });

            // 3. Create options jika ada
            if (questionData.options && questionData.options.length > 0) {
                const optionsData = questionData.options.map((optionText, idx) => ({
                    question_id: question.id,
                    option_text: optionText,
                    order_number: idx + 1
                }));

                await QuestionOption.bulkCreate(optionsData, { transaction });
            }
        }

        await transaction.commit();

        res.status(201).json({
            success: true,
            message: 'Ujian berhasil disimpan',
            data: {
                examId: exam.id,
                totalQuestions: questions.length
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error creating exam:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menyimpan ujian',
            error: error.message
        });
    }
};

// 2. GET ALL EXAMS - Ambil semua ujian
export const getAllExams = async (req, res) => {
    try {
        const exams = await Exam.findAll({
            attributes: ['id', 'title', 'description', 'created_by', 'created_at', 'updated_at'],
            include: [{
                model: Question,
                as: 'questions',
                attributes: ['id']
            }],
            order: [['created_at', 'DESC']]
        });

        // Format response dengan jumlah soal
        const formattedExams = exams.map(exam => ({
            id: exam.id,
            title: exam.title,
            description: exam.description,
            created_by: exam.created_by,
            created_at: exam.created_at,
            updated_at: exam.updated_at,
            totalQuestions: exam.questions.length
        }));

        res.json({
            success: true,
            data: formattedExams
        });

    } catch (error) {
        console.error('Error fetching exams:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data ujian',
            error: error.message
        });
    }
};

// 3. GET EXAM BY ID - Ambil detail ujian lengkap
export const getExamById = async (req, res) => {
    try {
        const examId = req.params.id;

        const exam = await Exam.findByPk(examId, {
            include: [{
                model: Question,
                as: 'questions',
                include: [{
                    model: QuestionOption,
                    as: 'options',
                    attributes: ['option_text', 'order_number']
                }],
                order: [['order_number', 'ASC']]
            }],
            order: [[{ model: Question, as: 'questions' }, 'order_number', 'ASC']]
        });

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Ujian tidak ditemukan'
            });
        }

        // Format response
        const formattedExam = {
            id: exam.id,
            title: exam.title,
            description: exam.description,
            created_by: exam.created_by,
            created_at: exam.created_at,
            updated_at: exam.updated_at,
            questions: exam.questions.map(q => ({
                id: q.id,
                question: q.question_text,
                type: q.question_type,
                required: q.is_required,
                order_number: q.order_number,
                options: q.options?.map(opt => opt.option_text) || []
            }))
        };

        res.json({
            success: true,
            data: formattedExam
        });

    } catch (error) {
        console.error('Error fetching exam:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil detail ujian',
            error: error.message
        });
    }
};

// 4. UPDATE EXAM - Update ujian
export const updateExam = async (req, res) => {
    const transaction = await db.transaction();
    
    try {
        const examId = req.params.id;
        const { title, description, questions } = req.body;

        // Cek apakah exam exists
        const exam = await Exam.findByPk(examId);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Ujian tidak ditemukan'
            });
        }

        // Update exam info
        await exam.update({
            title,
            description: description || null
        }, { transaction });

        // Delete old questions (CASCADE akan hapus options)
        await Question.destroy({
            where: { exam_id: examId },
            transaction
        });

        // Insert new questions
        for (let i = 0; i < questions.length; i++) {
            const questionData = questions[i];
            
            const question = await Question.create({
                exam_id: examId,
                question_text: questionData.question,
                question_type: questionData.type,
                is_required: questionData.required !== false,
                order_number: i + 1
            }, { transaction });

            // Create options
            if (questionData.options && questionData.options.length > 0) {
                const optionsData = questionData.options.map((optionText, idx) => ({
                    question_id: question.id,
                    option_text: optionText,
                    order_number: idx + 1
                }));

                await QuestionOption.bulkCreate(optionsData, { transaction });
            }
        }

        await transaction.commit();

        res.json({
            success: true,
            message: 'Ujian berhasil diupdate'
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error updating exam:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengupdate ujian',
            error: error.message
        });
    }
};

// 5. DELETE EXAM - Hapus ujian
export const deleteExam = async (req, res) => {
    try {
        const examId = req.params.id;

        const exam = await Exam.findByPk(examId);
        if (!exam) {
            return res.status(404).json({
                success: false,
                message: 'Ujian tidak ditemukan'
            });
        }

        await exam.destroy();

        res.json({
            success: true,
            message: 'Ujian berhasil dihapus'
        });

    } catch (error) {
        console.error('Error deleting exam:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus ujian',
            error: error.message
        });
    }
};

// 6. SUBMIT STUDENT ANSWER - Simpan jawaban siswa
export const submitAnswer = async (req, res) => {
    const transaction = await db.transaction();
    
    try {
        const examId = req.params.id;
        const { student_id, answers } = req.body;

        if (!student_id || !answers || answers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'student_id dan answers wajib diisi'
            });
        }

        // Hapus jawaban lama jika ada (untuk re-submit)
        await StudentAnswer.destroy({
            where: {
                exam_id: examId,
                student_id: student_id
            },
            transaction
        });

        // Insert jawaban baru
        const answersData = answers.map(answer => ({
            exam_id: examId,
            question_id: answer.question_id,
            student_id: student_id,
            answer_text: answer.answer_text
        }));

        await StudentAnswer.bulkCreate(answersData, { transaction });

        await transaction.commit();

        res.json({
            success: true,
            message: 'Jawaban berhasil disimpan'
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Error submitting answers:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menyimpan jawaban',
            error: error.message
        });
    }
};

// 7. GET STUDENT ANSWERS - Ambil jawaban siswa
export const getStudentAnswers = async (req, res) => {
    try {
        const { examId, studentId } = req.params;

        const answers = await StudentAnswer.findAll({
            where: {
                exam_id: examId,
                student_id: studentId
            },
            include: [{
                model: Question,
                attributes: ['question_text', 'question_type', 'order_number']
            }],
            order: [[{ model: Question }, 'order_number', 'ASC']]
        });

        res.json({
            success: true,
            data: answers
        });

    } catch (error) {
        console.error('Error fetching student answers:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil jawaban siswa',
            error: error.message
        });
    }
};

// 8. GET ALL SUBMISSIONS BY EXAM - Ambil semua siswa yang submit
export const getExamSubmissions = async (req, res) => {
    try {
        const examId = req.params.id;

        const submissions = await StudentAnswer.findAll({
            where: { exam_id: examId },
            attributes: [
                'student_id',
                [db.fn('MIN', db.col('submitted_at')), 'submitted_at'],
                [db.fn('COUNT', db.col('id')), 'total_answers']
            ],
            group: ['student_id'],
            order: [[db.fn('MIN', db.col('submitted_at')), 'DESC']]
        });

        res.json({
            success: true,
            data: submissions
        });

    } catch (error) {
        console.error('Error fetching submissions:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data submissions',
            error: error.message
        });
    }
};