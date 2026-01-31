import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Eye, Save, CheckCircle } from 'lucide-react';

const TeacherExamCreator = () => {
  const [examTitle, setExamTitle] = useState('');
  const [examDescription, setExamDescription] = useState('');
  const [questions, setQuestions] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // API Base URL - Sesuaikan dengan backend Anda
  const API_URL = 'http://localhost:3000/api';

  // State untuk form tambah soal
  const [questionType, setQuestionType] = useState('multiple_choice');
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isRequired, setIsRequired] = useState(true);

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addQuestion = () => {
    if (!questionText.trim()) {
      alert('Pertanyaan tidak boleh kosong!');
      return;
    }

    if ((questionType === 'multiple_choice' || questionType === 'checkbox') && 
        options.filter(opt => opt.trim()).length < 2) {
      alert('Minimal harus ada 2 pilihan jawaban!');
      return;
    }

    const newQuestion = {
      id: Date.now(),
      type: questionType,
      question: questionText,
      required: isRequired
    };

    if (questionType === 'multiple_choice' || questionType === 'checkbox') {
      newQuestion.options = options.filter(opt => opt.trim());
    }

    setQuestions([...questions, newQuestion]);
    
    // Reset form
    setQuestionText('');
    setOptions(['', '']);
    setQuestionType('multiple_choice');
    setIsRequired(true);
  };

  const deleteQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const moveQuestion = (index, direction) => {
    const newQuestions = [...questions];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex >= 0 && newIndex < questions.length) {
      [newQuestions[index], newQuestions[newIndex]] = [newQuestions[newIndex], newQuestions[index]];
      setQuestions(newQuestions);
    }
  };

  // FUNGSI BARU: Simpan ke Database
  const saveToDatabase = async () => {
    if (!examTitle.trim()) {
      alert('Judul ujian tidak boleh kosong!');
      return;
    }

    if (questions.length === 0) {
      alert('Tambahkan minimal 1 soal!');
      return;
    }

    setSaving(true);
    setSaveSuccess(false);

    try {
      const examData = {
        title: examTitle,
        description: examDescription,
        questions: questions,
        created_by: 1 // Ganti dengan ID guru yang login
      };

      const response = await fetch(`${API_URL}/exams`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(examData)
      });

      const result = await response.json();

      if (result.success) {
        setSaveSuccess(true);
        alert(`✅ Ujian berhasil disimpan!\nID Ujian: ${result.data.examId}\nTotal Soal: ${result.data.totalQuestions}`);
        
        // Reset form setelah berhasil
        // setExamTitle('');
        // setExamDescription('');
        // setQuestions([]);
      } else {
        alert('❌ Gagal menyimpan ujian: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Terjadi kesalahan koneksi ke server');
    } finally {
      setSaving(false);
    }
  };

  const exportJSON = () => {
    const examData = {
      title: examTitle,
      description: examDescription,
      questions: questions
    };
    
    const dataStr = JSON.stringify(examData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exam-data.json';
    link.click();
  };

  // Preview Component
  const PreviewExam = () => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-3xl w-full my-8">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-lg">
            <h2 className="text-xl font-bold">Preview Soal</h2>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-500 hover:text-gray-700 font-bold text-2xl"
            >
              ×
            </button>
          </div>
          
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="bg-purple-100 rounded-lg p-6 mb-6">
              <h1 className="text-2xl font-bold mb-2">{examTitle || 'Judul Ujian'}</h1>
              <p className="text-gray-700">{examDescription || 'Deskripsi ujian'}</p>
            </div>

            {questions.map((question, index) => (
              <div key={question.id} className="bg-white border rounded-lg p-4 mb-4">
                <h3 className="font-medium mb-3">
                  {index + 1}. {question.question}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>

                {question.type === 'multiple_choice' && (
                  <div className="space-y-2">
                    {question.options.map((option, idx) => (
                      <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" name={`q-${question.id}`} className="w-4 h-4" />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'checkbox' && (
                  <div className="space-y-2">
                    {question.options.map((option, idx) => (
                      <label key={idx} className="flex items-center space-x-2 cursor-pointer">
                        <input type="checkbox" className="w-4 h-4" />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}

                {question.type === 'short_answer' && (
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Jawaban singkat"
                  />
                )}

                {question.type === 'long_answer' && (
                  <textarea
                    rows="4"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    placeholder="Jawaban panjang"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-blue-600 text-white rounded-t-lg p-6">
          <h1 className="text-3xl font-bold mb-2">Buat Soal Baru</h1>
        </div>

        {/* Success Message */}
        {saveSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Ujian berhasil disimpan ke database!</span>
          </div>
        )}

        {/* Info Ujian */}
        <div className="bg-white border-x border-b p-6 mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Soal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Contoh: Ujian Matematika Semester 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi Soal
            </label>
            <textarea
              value={examDescription}
              onChange={(e) => setExamDescription(e.target.value)}
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Jelaskan instruksi ujian, waktu pengerjaan, dll."
            />
          </div>
        </div>

        {/* Form Tambah Soal */}
        <div className="bg-white rounded-lg border p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Plus className="w-6 h-6 mr-2" />
            Tambah Soal
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipe Soal
              </label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="multiple_choice">Pilihan Ganda</option>
                <option value="checkbox">Kotak Centang (Pilih Banyak)</option>
                <option value="short_answer">Jawaban Singkat</option>
                <option value="long_answer">Jawaban Panjang</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pertanyaan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows="2"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tulis pertanyaan di sini..."
              />
            </div>

            {(questionType === 'multiple_choice' || questionType === 'checkbox') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilihan Jawaban
                </label>
                {options.map((option, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`Pilihan ${index + 1}`}
                    />
                    {options.length > 2 && (
                      <button
                        onClick={() => removeOption(index)}
                        className="text-red-500 hover:text-red-700 px-3"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addOption}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
                >
                  + Tambah Pilihan
                </button>
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="required"
                checked={isRequired}
                onChange={(e) => setIsRequired(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <label htmlFor="required" className="ml-2 text-sm text-gray-700">
                Wajib dijawab
              </label>
            </div>

            <button
              onClick={addQuestion}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Tambahkan Soal
            </button>
          </div>
        </div>

        {/* Daftar Soal */}
        {questions.length > 0 && (
          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Daftar Soal ({questions.length})</h2>
            
            <div className="space-y-3">
              {questions.map((question, index) => (
                <div key={question.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col gap-1 mt-1">
                      <button
                        onClick={() => moveQuestion(index, 'up')}
                        disabled={index === 0}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <GripVertical className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium">
                          {index + 1}. {question.question}
                          {question.required && <span className="text-red-500 ml-1">*</span>}
                        </h3>
                      </div>
                      
                      <div className="text-sm text-gray-500 mb-2">
                        Tipe: {
                          question.type === 'multiple_choice' ? 'Pilihan Ganda' :
                          question.type === 'checkbox' ? 'Kotak Centang' :
                          question.type === 'short_answer' ? 'Jawaban Singkat' :
                          'Jawaban Panjang'
                        }
                      </div>

                      {question.options && (
                        <ul className="text-sm text-gray-600 list-disc list-inside">
                          {question.options.map((opt, idx) => (
                            <li key={idx}>{opt}</li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <button
                      onClick={() => deleteQuestion(question.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {questions.length > 0 && (
          <div className="bg-white rounded-lg border p-6 space-y-3">
            <button
              onClick={() => setShowPreview(true)}
              className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-5 h-5" />
              Preview Ujian
            </button>
            
            <button
              onClick={saveToDatabase}
              disabled={saving}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" />
              {saving ? 'Menyimpan...' : 'Simpan ke Database'}
            </button>

            <button
              onClick={exportJSON}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Export JSON (Backup)
            </button>
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && <PreviewExam />}
      </div>
    </div>
  );
};

export default TeacherExamCreator;