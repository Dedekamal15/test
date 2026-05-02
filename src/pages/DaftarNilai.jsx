import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_AUTH_URL?.replace('/api/auth', '/api') || 'http://tst.lan:5001/api';

/* ── Tabel Hasil Jawaban ─────────────────────────── */
function ResultsTable({ examId, examTitle, onBack }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [exporting, setExporting] = useState(false);

    useEffect(() => {
        fetch(`${API_URL}/exams/${examId}/results`, { credentials: 'include' })
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(() => { setError('Gagal memuat hasil'); setLoading(false); });
    }, [examId]);

    const handleExport = async () => {
        setExporting(true);
        try {
            const res = await fetch(`${API_URL}/exams/${examId}/export`, {
                credentials: 'include'
            });
            if (!res.ok) throw new Error('Gagal export');
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hasil_${examTitle.replace(/\s+/g, '_')}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            alert('❌ ' + err.message);
        } finally {
            setExporting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (error) return (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4">{error}</div>
    );

    const { questions = [], results = [] } = data || {};

    return (
        <div>
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                    <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 mb-1 flex items-center gap-1">
                        ← Kembali
                    </button>
                    <h2 className="text-xl font-bold text-gray-800">{examTitle}</h2>
                    <p className="text-sm text-gray-500">{results.length} siswa telah mengumpulkan</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={exporting || results.length === 0}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2.5 rounded-xl transition disabled:opacity-50"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {exporting ? 'Mengexport...' : 'Export CSV'}
                </button>
            </div>

            {results.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <div className="text-5xl mb-3">📭</div>
                    <p className="font-medium">Belum ada siswa yang mengumpulkan</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">No</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Username</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Kelas</th>
                                <th className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap">Waktu Submit</th>
                                {questions.map((q, i) => (
                                    <th key={q.id} className="px-4 py-3 text-left font-semibold text-gray-600 whitespace-nowrap max-w-[150px]">
                                        <div className="truncate" title={q.question}>
                                            Soal {i + 1}
                                        </div>
                                        <div className="text-xs font-normal text-gray-400 truncate max-w-[120px]" title={q.question}>
                                            {q.question.substring(0, 25)}{q.question.length > 25 ? '...' : ''}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((r, i) => (
                                <tr key={r.student_id} className={`border-b border-gray-50 hover:bg-gray-50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                                    <td className="px-4 py-3 font-medium text-gray-800">{r.username}</td>
                                    <td className="px-4 py-3 text-gray-600">{r.kelas || '-'}</td>
                                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                        {new Date(r.submitted_at).toLocaleString('id-ID')}
                                    </td>
                                    {questions.map(q => {
                                        const ans = r.answers[q.id];
                                        const display = !ans ? (
                                            <span className="text-gray-300 italic">-</span>
                                        ) : Array.isArray(ans) ? (
                                            <span>{ans.join(', ')}</span>
                                        ) : (
                                            <span>{String(ans)}</span>
                                        );
                                        return (
                                            <td key={q.id} className="px-4 py-3 text-gray-700 max-w-[150px]">
                                                <div className="truncate" title={Array.isArray(ans) ? ans.join(', ') : String(ans || '')}>
                                                    {display}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

/* ── Card Ujian ──────────────────────────────────── */
function ExamCard({ exam, onView, onToggle }) {
    const [toggling, setToggling] = useState(false);

    const handleToggle = async () => {
        setToggling(true);
        await onToggle(exam.id, !exam.is_active);
        setToggling(false);
    };

    return (
        <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 hover:border-blue-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-800 text-base leading-tight">{exam.title}</h3>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ml-2
          ${exam.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {exam.is_active ? '● Aktif' : '○ Nonaktif'}
                </span>
            </div>

            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{exam.description || 'Tidak ada deskripsi'}</p>

            <div className="flex flex-wrap gap-3 text-xs text-gray-400 mb-4">
                <span>⏱ {exam.duration} menit</span>
                <span>❓ {exam.total_questions} soal</span>
                <span>👥 {exam.total_submissions} submission</span>
                <span>👤 {exam.created_by_name}</span>
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onView(exam.id, exam.title)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-xl transition"
                >
                    Lihat Hasil
                </button>
                <button
                    onClick={handleToggle}
                    disabled={toggling}
                    className={`flex-1 text-sm font-semibold py-2 rounded-xl border-2 transition disabled:opacity-50
            ${exam.is_active
                            ? 'border-red-200 text-red-500 hover:bg-red-50'
                            : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                >
                    {toggling ? '...' : exam.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
            </div>
        </div>
    );
}

/* ── Halaman Utama Daftar Nilai ──────────────────── */
export default function DaftarNilai() {
    const { user } = useAuth();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState(null); // { id, title }

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/exams/all`, { credentials: 'include' });
            if (!res.ok) throw new Error('Gagal memuat data');
            const data = await res.json();
            setExams(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (examId, isActive) => {
        try {
            await fetch(`${API_URL}/exams/${examId}/toggle`, {
                method: 'PATCH',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: isActive }),
            });
            setExams(prev => prev.map(e => e.id === examId ? { ...e, is_active: isActive } : e));
        } catch {
            alert('Gagal mengubah status ujian');
        }
    };

    // Tampilkan tabel hasil jika exam dipilih
    if (selected) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <ResultsTable
                        examId={selected.id}
                        examTitle={selected.title}
                        onBack={() => setSelected(null)}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Daftar Nilai</h1>
                    <p className="text-gray-500 mt-1">Kelola ujian dan lihat hasil jawaban siswa.</p>
                </div>

                {loading && (
                    <div className="flex justify-center py-16">
                        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">❌ {error}</div>
                )}

                {!loading && !error && exams.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <div className="text-5xl mb-3">📋</div>
                        <p className="text-lg font-medium">Belum ada ujian dibuat</p>
                        <p className="text-sm mt-1">Buat soal terlebih dahulu di menu Buat Soal.</p>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exams.map(exam => (
                        <ExamCard
                            key={exam.id}
                            exam={exam}
                            onView={(id, title) => setSelected({ id, title })}
                            onToggle={handleToggle}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}