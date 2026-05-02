import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const AuthContext = createContext();

const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://tst.lan:5001/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuru, setIsGuru] = useState(false);
  const [loading, setLoading] = useState(true); // true until verify finishes

  /* ── Verify session on mount (SSO: cookie-based) ── */
  useEffect(() => {
    verifySession();
  }, []);

  const verifySession = useCallback(async () => {
    try {
      const res = await fetch(`${AUTH_URL}/verify`, {
        method: 'GET',
        credentials: 'include', // send httpOnly cookie
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setIsAuthenticated(true);
        setIsGuru(data.user.role === 'guru' || data.user.role === 'admin');
      } else {
        // Try silent refresh before giving up
        await silentRefresh();
      }
    } catch {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const silentRefresh = async () => {
    try {
      const res = await fetch(`${AUTH_URL}/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        // Retry verify after refresh
        const vRes = await fetch(`${AUTH_URL}/verify`, {
          credentials: 'include',
        });
        if (vRes.ok) {
          const data = await vRes.json();
          setUser(data.user);
          setIsAuthenticated(true);
          setIsGuru(data.user.role === 'guru' || data.user.role === 'admin');
          return;
        }
      }
    } catch { /* ignore */ }
    setIsAuthenticated(false);
    setUser(null);
  };

  /* ── Login ──────────────────────────────────────── */
  const login = async ({ username, password }) => {
    const res = await fetch(`${AUTH_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login gagal');

    setUser(data.user);
    setIsAuthenticated(true);
    setIsGuru(data.user.role === 'guru' || data.user.role === 'admin');
    return data;
  };

  /* ── Logout ─────────────────────────────────────── */
  const logout = async () => {
    try {
      await fetch(`${AUTH_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch { /* ignore network errors on logout */ }
    setUser(null);
    setIsAuthenticated(false);
    setIsGuru(false);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isGuru, loading, login, logout, verifySession }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);