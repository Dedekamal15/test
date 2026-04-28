import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { JWT_CONFIG, COOKIE_CONFIG } from '../config/jwt.js';
import { isBlacklisted, blacklistToken } from '../utils/tokenBlacklist.js';

/* ─── Token Generators ─────────────────────────────── */

export function generateAccessToken(payload) {
  const jti = uuidv4();
  return jwt.sign({ ...payload, jti }, JWT_CONFIG.accessSecret, {
    expiresIn: JWT_CONFIG.accessExpiresIn,
  });
}

export function generateRefreshToken(payload) {
  const jti = uuidv4();
  return jwt.sign({ ...payload, jti }, JWT_CONFIG.refreshSecret, {
    expiresIn: JWT_CONFIG.refreshExpiresIn,
  });
}

/* ─── Cookie Helpers ───────────────────────────────── */

export function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie('access_token', accessToken, {
    ...COOKIE_CONFIG,
    maxAge: 15 * 60 * 1000, // 15 min
  });
  res.cookie('refresh_token', refreshToken, {
    ...COOKIE_CONFIG,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/auth', // restrict refresh cookie to auth routes only
  });
}

export function clearAuthCookies(res) {
  res.clearCookie('access_token', COOKIE_CONFIG);
  res.clearCookie('refresh_token', { ...COOKIE_CONFIG, path: '/api/auth' });
}

/* ─── Middleware: requireAuth ──────────────────────── */

export function requireAuth(req, res, next) {
  try {
    // 1. Try cookie first (SSO flow)
    let token = req.cookies?.access_token;

    // 2. Fallback: Authorization: Bearer <token>
    if (!token) {
      const header = req.headers.authorization || '';
      if (header.startsWith('Bearer ')) token = header.slice(7);
    }

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: no token provided' });
    }

    const decoded = jwt.verify(token, JWT_CONFIG.accessSecret);

    if (isBlacklisted(decoded.jti)) {
      return res.status(401).json({ error: 'Unauthorized: token has been revoked' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Unauthorized: token expired' });
    }
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
}

/* ─── Middleware: optionalAuth ─────────────────────── */

export function optionalAuth(req, res, next) {
  try {
    let token = req.cookies?.access_token;
    if (!token) {
      const header = req.headers.authorization || '';
      if (header.startsWith('Bearer ')) token = header.slice(7);
    }
    if (token) {
      const decoded = jwt.verify(token, JWT_CONFIG.accessSecret);
      if (!isBlacklisted(decoded.jti)) req.user = decoded;
    }
  } catch (_) {
    // ignore errors — auth is optional
  }
  next();
}

export { blacklistToken };
