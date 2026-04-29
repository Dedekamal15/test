import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// ── Lazy Loaded Pages ───────────────────────────────────────────────────────
// Setiap halaman hanya akan di-download saat user membuka route-nya.
const Home   = lazy(() => import('./pages/Home'));
const Belajar = lazy(() => import('./pages/Belajar'));
const Login  = lazy(() => import('./pages/Login'));
const Test   = lazy(() => import('./pages/InputSoal'));

// ── Fallback Spinner ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-gray-500">
        <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
        <span className="text-sm">Memuat halaman...</span>
      </div>
    </div>
  );
}

// ── Protected Route ────────────────────────────────────────────────────────
// Redirects to /login if not authenticated.
// If guruOnly=true, juga block siswa biasa.
function ProtectedRoute({ children, guruOnly = false }) {
  const { isAuthenticated, isGuru, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-500">
          <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <span className="text-sm">Memuat...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Simpan halaman tujuan agar bisa redirect setelah login
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  if (guruOnly && !isGuru) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route path="/"      element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected — harus login */}
        <Route path="/belajar" element={
          <ProtectedRoute><Belajar /></ProtectedRoute>
        } />
        <Route path="/bermain" element={
          <ProtectedRoute>
            {/* Placeholder sampai halaman Bermain dibuat */}
            <div className="flex h-screen items-center justify-center text-gray-500 text-lg">
              Halaman Bermain (Coming Soon)
            </div>
          </ProtectedRoute>
        } />

        {/* Protected — khusus Guru/Admin */}
        <Route path="/test" element={
          <ProtectedRoute guruOnly>
            <Test />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;