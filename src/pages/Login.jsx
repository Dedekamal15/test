import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:5001/api/auth';

// ── Shared password visibility toggle ────────────────────────
function EyeIcon({ visible }) {
  return visible ? (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  ) : (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function AlertError({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
          clipRule="evenodd" />
      </svg>
      {message}
    </div>
  );
}

function AlertSuccess({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
      <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd" />
      </svg>
      {message}
    </div>
  );
}

// ── TAB: Login ────────────────────────────────────────────────
function LoginForm({ onSwitchTab }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const { login } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const from = location.state?.from || '/';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('Username dan password wajib diisi');
      return;
    }
    setLoading(true);
    try {
      const data = await login({ username: username.trim(), password });
      const role = data.user?.role;
      // Redirect ke halaman asal atau dashboard sesuai role
      if (from && from !== '/login') {
        navigate(from, { replace: true });
      } else if (role === 'guru' || role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="px-8 py-6 space-y-5">
      <AlertError message={error} />

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-username">
          Username
        </label>
        <input
          id="login-username"
          type="text"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          placeholder="Masukkan username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="login-password">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPass ? 'text' : 'password'}
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <button type="button" tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPass(!showPass)}>
            <EyeIcon visible={showPass} />
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        id="login-submit" type="submit" disabled={loading}
        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Memproses...
          </>
        ) : 'Masuk'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Belum punya akun?{' '}
        <button type="button" onClick={onSwitchTab}
          className="text-blue-600 font-semibold hover:underline">
          Daftar sekarang
        </button>
      </p>
    </form>
  );
}

// ── TAB: Register ─────────────────────────────────────────────
function RegisterForm({ onSwitchTab }) {
  const [form, setForm] = useState({
    username: '', password: '', confirmPassword: '', kelas: '',
  });
  const [showPass, setShowPass]         = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [error, setError]               = useState('');
  const [success, setSuccess]           = useState('');
  const [loading, setLoading]           = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.username.trim() || !form.password || !form.kelas) {
      setError('Username, password, dan kelas wajib diisi');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi password tidak cocok');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password,
          kelas: form.kelas,
          role: 'siswa',
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Pendaftaran gagal');

      setSuccess('Akun berhasil dibuat! Silakan login.');
      setForm({ username: '', password: '', confirmPassword: '', kelas: '' });
      // Auto-switch ke tab Login setelah 1.5s
      setTimeout(() => onSwitchTab(), 1500);
    } catch (err) {
      setError(err.message || 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  const kelasOptions = [4,5,6,7,8,9,10,11,12];

  return (
    <form onSubmit={handleRegister} className="px-8 py-6 space-y-4">
      <AlertError message={error} />
      <AlertSuccess message={success} />

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-username">
          Username
        </label>
        <input
          id="reg-username" type="text"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          placeholder="Buat username unik"
          value={form.username}
          onChange={update('username')}
          autoComplete="username"
          required
        />
      </div>

      {/* Kelas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-kelas">
          Kelas
        </label>
        <select
          id="reg-kelas"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          value={form.kelas}
          onChange={update('kelas')}
          required
        >
          <option value="">-- Pilih Kelas --</option>
          {kelasOptions.map((k) => (
            <option key={k} value={String(k)}>Kelas {k}</option>
          ))}
        </select>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-password">
          Password
        </label>
        <div className="relative">
          <input
            id="reg-password"
            type={showPass ? 'text' : 'password'}
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Minimal 6 karakter"
            value={form.password}
            onChange={update('password')}
            autoComplete="new-password"
            required
          />
          <button type="button" tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPass(!showPass)}>
            <EyeIcon visible={showPass} />
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reg-confirm">
          Konfirmasi Password
        </label>
        <div className="relative">
          <input
            id="reg-confirm"
            type={showConfirm ? 'text' : 'password'}
            className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Ulangi password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            autoComplete="new-password"
            required
          />
          <button type="button" tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowConfirm(!showConfirm)}>
            <EyeIcon visible={showConfirm} />
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        id="register-submit" type="submit" disabled={loading}
        className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 text-white font-semibold rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Mendaftarkan...
          </>
        ) : 'Daftar'}
      </button>

      <p className="text-center text-sm text-gray-500">
        Sudah punya akun?{' '}
        <button type="button" onClick={onSwitchTab}
          className="text-indigo-600 font-semibold hover:underline">
          Masuk di sini
        </button>
      </p>
    </form>
  );
}

// ── Main Page ─────────────────────────────────────────────────
function Login() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'

  const isLogin = tab === 'login';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 pt-16">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className={`px-8 py-8 text-center transition-all duration-300 bg-gradient-to-r ${isLogin ? 'from-blue-600 to-indigo-600' : 'from-indigo-600 to-purple-600'}`}>
            <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-full mb-3">
              {isLogin ? (
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isLogin ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h1>
            <p className="text-white/80 text-sm mt-1">
              {isLogin ? 'Masuk ke akun Anda' : 'Daftar sebagai siswa'}
            </p>
          </div>

          {/* Tab Bar */}
          <div className="flex border-b border-gray-200">
            <button
              id="tab-login"
              onClick={() => setTab('login')}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${
                isLogin
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Login
            </button>
            <button
              id="tab-register"
              onClick={() => setTab('register')}
              className={`flex-1 py-3 text-sm font-semibold transition-all ${
                !isLogin
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Tab Content */}
          {isLogin
            ? <LoginForm onSwitchTab={() => setTab('register')} />
            : <RegisterForm onSwitchTab={() => setTab('login')} />
          }
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          SSO Auth Server — JWT + httpOnly Cookie
        </p>
      </div>
    </div>
  );
}

export default Login;
