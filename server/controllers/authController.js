import jwt from 'jsonwebtoken';
import {
  findUserByUsername,
  findUserById,
  createUser,
  verifyPassword,
} from '../models/User.js';
import {
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  clearAuthCookies,
} from '../middleware/auth.js';
import { blacklistToken, isBlacklisted } from '../utils/tokenBlacklist.js';
import { JWT_CONFIG, COOKIE_CONFIG } from '../config/jwt.js';

/* ─── POST /api/auth/login ─────────────────────────── */
export async function login(req, res) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    const user = await findUserByUsername(username.trim());
    if (!user) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const payload = {
      sub: user.id,
      username: user.username,
      kelas: user.kelas,
      role: user.role,
    };

    const accessToken  = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: 'Login berhasil',
      accessToken, // also returned in body for non-cookie clients
      user: {
        id: user.id,
        username: user.username,
        kelas: user.kelas,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[login]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/* ─── POST /api/auth/logout ────────────────────────── */
export async function logout(req, res) {
  try {
    // Blacklist access token
    const accessToken = req.cookies?.access_token
      || (req.headers.authorization || '').replace('Bearer ', '');

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, JWT_CONFIG.accessSecret);
        blacklistToken(decoded.jti, decoded.exp * 1000);
      } catch (_) { /* token may already be expired — that's fine */ }
    }

    // Blacklist refresh token
    const refreshToken = req.cookies?.refresh_token;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, JWT_CONFIG.refreshSecret);
        blacklistToken(decoded.jti, decoded.exp * 1000);
      } catch (_) {}
    }

    clearAuthCookies(res);
    return res.status(200).json({ message: 'Logout berhasil' });
  } catch (err) {
    console.error('[logout]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/* ─── GET /api/auth/verify ─────────────────────────── */
export async function verify(req, res) {
  try {
    // Token already validated by requireAuth middleware → req.user is set
    const user = await findUserById(req.user.sub);
    if (!user) {
      return res.status(401).json({ error: 'User tidak ditemukan' });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        kelas: user.kelas,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[verify]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/* ─── POST /api/auth/refresh ───────────────────────── */
export async function refresh(req, res) {
  try {
    const token = req.cookies?.refresh_token;
    if (!token) {
      return res.status(401).json({ error: 'Refresh token tidak ditemukan' });
    }

    const decoded = jwt.verify(token, JWT_CONFIG.refreshSecret);

    if (isBlacklisted(decoded.jti)) {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Refresh token telah dicabut' });
    }

    const user = await findUserById(decoded.sub);
    if (!user) {
      return res.status(401).json({ error: 'User tidak ditemukan' });
    }

    // Blacklist old refresh token (rotation)
    blacklistToken(decoded.jti, decoded.exp * 1000);

    const payload = {
      sub: user.id,
      username: user.username,
      kelas: user.kelas,
      role: user.role,
    };

    const newAccessToken  = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({
      message: 'Token diperbarui',
      accessToken: newAccessToken,
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      clearAuthCookies(res);
      return res.status(401).json({ error: 'Refresh token kedaluwarsa, silakan login kembali' });
    }
    console.error('[refresh]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/* ─── POST /api/auth/register ──────────────────────── */
export async function register(req, res) {
  try {
    const { username, password, kelas } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    // Cek duplikat username
    const existing = await findUserByUsername(username.trim());
    if (existing) {
      return res.status(409).json({ error: 'Username sudah digunakan' });
    }

    // Role selalu 'siswa' untuk registrasi publik
    const id = await createUser({
      username: username.trim(),
      password,
      kelas: kelas || null,
      role: 'siswa',
    });

    return res.status(201).json({
      message: 'Akun berhasil dibuat',
      userId: id,
    });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
