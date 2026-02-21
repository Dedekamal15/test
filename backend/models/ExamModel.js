// ===== FILE: models/ExamModel.js =====
import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

// Model Exam
export const Exam = db.define('exams', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

// Model Question
export const Question = db.define('questions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question_text: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    question_type: {
        type: DataTypes.ENUM('multiple_choice', 'checkbox', 'short_answer', 'long_answer'),
        allowNull: false
    },
    is_required: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    order_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Model QuestionOption
export const QuestionOption = db.define('question_options', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    option_text: {
        type: DataTypes.STRING(500),
        allowNull: false
    },
    order_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

// Model StudentAnswer
export const StudentAnswer = db.define('student_answers', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    exam_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    answer_text: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'submitted_at',
    updatedAt: false
});

// ===== RELATIONSHIPS / ASSOCIATIONS =====

// Exam has many Questions
Exam.hasMany(Question, {
    foreignKey: 'exam_id',
    onDelete: 'CASCADE',
    as: 'questions'
});
Question.belongsTo(Exam, {
    foreignKey: 'exam_id'
});

// Question has many Options
Question.hasMany(QuestionOption, {
    foreignKey: 'question_id',
    onDelete: 'CASCADE',
    as: 'options'
});
QuestionOption.belongsTo(Question, {
    foreignKey: 'question_id'
});

// Question has many StudentAnswers
Question.hasMany(StudentAnswer, {
    foreignKey: 'question_id',
    onDelete: 'CASCADE',
    as: 'answers'
});
StudentAnswer.belongsTo(Question, {
    foreignKey: 'question_id'
});

// Exam has many StudentAnswers
Exam.hasMany(StudentAnswer, {
    foreignKey: 'exam_id',
    onDelete: 'CASCADE',
    as: 'submissions'
});
StudentAnswer.belongsTo(Exam, {
    foreignKey: 'exam_id'
});


await db.sync({ alter: true });

export default { Exam, Question, QuestionOption, StudentAnswer };