import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_AUTH_URL?.replace('/api/auth', '/api') || 'http://tst.lan:5001/api';

/* ── Daftar Ujian ─────────────────────────────────── */
function ExamCard({ exam, onStart, submitted }) {
    return (
        <div className={`bg-white rounded-2xl border-2 p-6 transition-all duration-200 hover:shadow-lg
      ${submitted ? 'border-green-200 bg-green-50' : 'border-gray-100 hover:border-blue-200'}`}>
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-gray-800">{exam.title}</h3>
                {submitted && (
                    <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
                        ✓ Selesai
                    </span>
                )}
            </div>
            <p className="text-sm text-gray-500 mb-4">{exam.description || 'Tidak ada deskripsi'}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                <span>⏱ {exam.duration} menit</span>
                <span>📅 {new Date(exam.created_at).toLocaleDateString('id-ID')}</span>
            </div>
            <button
                onClick={() => onStart(exam.id)}
                disabled={submitted}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-200
          ${submitted
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95'}`}
            >
                {submitted ? 'Sudah Dikerjakan' : 'Mulai Ujian'}
            </button>
        </div>
    );
}

/* ── Form Pengerjaan Ujian ────────────────────────── */
function ExamForm({ exam, onSubmit, onBack }) {
    const [answers, setAnswers] = useState({});
    const [current, setCurrent] = useState(0);
    const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
    const [submitting, setSubmitting] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const questions = exam.questions || [];
    const q = questions[current];

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }
        const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
        return () => clearInterval(t);
    }, [timeLeft]);

    const formatTime = (s) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    };

    const setAnswer = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const setCheckbox = (questionId, value, checked) => {
        setAnswers(prev => {
            const current = prev[questionId] || [];
            if (checked) return { ...prev, [questionId]: [...current, value] };
            return { ...prev, [questionId]: current.filter(v => v !== value) };
        });
    };

    const handleSubmit = useCallback(async () => {
        setSubmitting(true);
        const formatted = Object.entries(answers).map(([question_id, answer]) => ({
            question_id: parseInt(question_id),
            answer,
        }));
        await onSubmit(exam.id, formatted);
        setSubmitting(false);
    }, [answers, exam.id, onSubmit]);

    const answered = Object.keys(answers).length;
    const progress = Math.round((answered / questions.length) * 100);
    const timerColor = timeLeft < 60 ? 'text-red-500' : timeLeft < 300 ? 'text-yellow-500' : 'text-green-600';

    return (
        <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                    <h2 className="font-bold text-gray-800 text-lg">{exam.title}</h2>
                    <p className="text-sm text-gray-400">{answered}/{questions.length} soal terjawab</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`font-mono text-2xl font-bold ${timerColor}`}>
                        ⏱ {formatTime(timeLeft)}
                    </span>
                    <button
                        onClick={() => setConfirmSubmit(true)}
                        disabled={submitting}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
                    >
                        Kumpulkan
                    </button>
                </div>
            </div>

            {/* Progress bar */}
            <div className="bg-gray-100 rounded-full h-2 mb-4">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Navigasi soal */}
            <div className="flex flex-wrap gap-2 mb-4">
                {questions.map((q, i) => (
                    <button
                        key={q.id}
                        onClick={() => setCurrent(i)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all
              ${i === current ? 'bg-blue-600 text-white' :
                                answers[q.id] !== undefined ? 'bg-green-100 text-green-700 border border-green-300' :
                                    'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Soal */}
            {q && (
                <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4">
                    <div className="flex items-start gap-3 mb-5">
                        <span className="bg-blue-600 text-white text-sm font-bold w-8 h-8 rounded-lg flex items-center justify-center shrink-0">
                            {current + 1}
                        </span>
                        <p className="text-gray-800 font-medium leading-relaxed">
                            {q.question}
                            {q.required && <span className="text-red-400 ml-1">*</span>}
                        </p>
                    </div>

                    {/* Pilihan Ganda */}
                    {q.type === 'multiple_choice' && (
                        <div className="space-y-2">
                            {q.options?.map((opt, i) => (
                                <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                  ${answers[q.id] === opt ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                    <input
                                        type="radio"
                                        name={`q-${q.id}`}
                                        value={opt}
                                        checked={answers[q.id] === opt}
                                        onChange={() => setAnswer(q.id, opt)}
                                        className="accent-blue-600"
                                    />
                                    <span className="text-gray-700">{opt}</span>
                                </label>
                            ))}
                        </div>
                    )}

                    {/* Checkbox */}
                    {q.type === 'checkbox' && (
                        <div className="space-y-2">
                            {q.options?.map((opt, i) => {
                                const checked = (answers[q.id] || []).includes(opt);
                                return (
                                    <label key={i} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all
                    ${checked ? 'border-blue-400 bg-blue-50' : 'border-gray-100 hover:border-gray-200'}`}>
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={(e) => setCheckbox(q.id, opt, e.target.checked)}
                                            className="accent-blue-600 w-4 h-4"
                                        />
                                        <span className="text-gray-700">{opt}</span>
                                    </label>
                                );
                            })}
                        </div>
                    )}

                    {/* Jawaban Singkat */}
                    {q.type === 'short_answer' && (
                        <input
                            type="text"
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswer(q.id, e.target.value)}
                            placeholder="Tulis jawaban singkat..."
                            className="w-full border-2 border-gray-100 focus:border-blue-400 rounded-xl px-4 py-3 outline-none transition"
                        />
                    )}

                    {/* Jawaban Panjang */}
                    {q.type === 'long_answer' && (
                        <textarea
                            rows={4}
                            value={answers[q.id] || ''}
                            onChange={(e) => setAnswer(q.id, e.target.value)}
                            placeholder="Tulis jawaban panjang..."
                            className="w-full border-2 border-gray-100 focus:border-blue-400 rounded-xl px-4 py-3 outline-none transition resize-none"
                        />
                    )}
                </div>
            )}

            {/* Navigasi prev/next */}
            <div className="flex justify-between">
                <button
                    onClick={() => setCurrent(c => Math.max(0, c - 1))}
                    disabled={current === 0}
                    className="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm disabled:opacity-30 hover:bg-gray-50 transition"
                >
                    ← Sebelumnya
                </button>
                {current < questions.length - 1 ? (
                    <button
                        onClick={() => setCurrent(c => Math.min(questions.length - 1, c + 1))}
                        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
                    >
                        Selanjutnya →
                    </button>
                ) : (
                    <button
                        onClick={() => setConfirmSubmit(true)}
                        className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition"
                    >
                        Kumpulkan ✓
                    </button>
                )}
            </div>

            {/* Modal konfirmasi */}
            {confirmSubmit && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">Kumpulkan Jawaban?</h3>
                        <p className="text-sm text-gray-500 mb-1">
                            Terjawab: <strong>{answered}</strong> dari <strong>{questions.length}</strong> soal.
                        </p>
                        {answered < questions.length && (
                            <p className="text-sm text-yellow-600 mb-4">
                                ⚠ Masih ada {questions.length - answered} soal yang belum dijawab.
                            </p>
                        )}
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={() => setConfirmSubmit(false)}
                                className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={() => { setConfirmSubmit(false); handleSubmit(); }}
                                disabled={submitting}
                                className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition disabled:opacity-50"
                            >
                                {submitting ? 'Menyimpan...' : 'Ya, Kumpulkan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Halaman Utama Test ───────────────────────────── */
export default function Test() {
    const { user } = useAuth();
    const [exams, setExams] = useState([]);
    const [submissions, setSubmissions] = useState({});
    const [activeExam, setActiveExam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/exams`, { credentials: 'include' });
            if (!res.ok) throw new Error('Gagal memuat daftar ujian');
            const data = await res.json();
            setExams(data);

            // Cek status submission untuk setiap ujian
            const statusMap = {};
            await Promise.all(data.map(async (exam) => {
                try {
                    const r = await fetch(`${API_URL}/exams/${exam.id}/status`, { credentials: 'include' });
                    if (r.ok) {
                        const s = await r.json();
                        statusMap[exam.id] = s.submitted;
                    }
                } catch { statusMap[exam.id] = false; }
            }));
            setSubmissions(statusMap);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStart = async (examId) => {
        try {
            const res = await fetch(`${API_URL}/exams/${examId}`, { credentials: 'include' });
            if (!res.ok) throw new Error('Gagal memuat soal');
            const data = await res.json();
            setActiveExam(data);
            setDone(false);
        } catch (err) {
            alert('❌ ' + err.message);
        }
    };

    const handleSubmit = async (examId, answers) => {
        try {
            const res = await fetch(`${API_URL}/exams/${examId}/submit`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Gagal mengumpulkan jawaban');
            setDone(true);
            setActiveExam(null);
            setSubmissions(prev => ({ ...prev, [examId]: true }));
        } catch (err) {
            alert('❌ ' + err.message);
        }
    };

    /* ── Selesai ── */
    if (done) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Jawaban Terkumpul!</h2>
                    <p className="text-gray-500 mb-6">Jawaban kamu berhasil disimpan.</p>
                    <button
                        onClick={() => setDone(false)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
                    >
                        Kembali ke Daftar Ujian
                    </button>
                </div>
            </div>
        );
    }

    /* ── Sedang mengerjakan ujian ── */
    if (activeExam) {
        return (
            <div className="min-h-screen bg-gray-50 py-6 px-4">
                <div className="max-w-3xl mx-auto mb-4">
                    <button
                        onClick={() => setActiveExam(null)}
                        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                    >
                        ← Kembali ke daftar ujian
                    </button>
                </div>
                <ExamForm exam={activeExam} onSubmit={handleSubmit} onBack={() => setActiveExam(null)} />
            </div>
        );
    }

    /* ── Daftar ujian ── */
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Daftar Ujian</h1>
                    <p className="text-gray-500 mt-1">Halo, <strong>{user?.username}</strong>! Pilih ujian yang ingin dikerjakan.</p>
                </div>

                {loading && (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                        ❌ {error}
                    </div>
                )}

                {!loading && !error && exams.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <div className="text-5xl mb-3">📭</div>
                        <p className="text-lg font-medium">Belum ada ujian tersedia</p>
                        <p className="text-sm mt-1">Guru belum membuat soal ujian.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exams.map(exam => (
                        <ExamCard
                            key={exam.id}
                            exam={exam}
                            onStart={handleStart}
                            submitted={submissions[exam.id] || false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}