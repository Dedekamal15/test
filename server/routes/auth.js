import { Router } from 'express';
import { login, logout, verify, refresh, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * @route  POST /api/auth/login
 * @desc   Authenticate user — sets httpOnly cookies + returns accessToken
 * @access Public
 */
router.post('/login', login);

/**
 * @route  POST /api/auth/logout
 * @desc   Revoke tokens and clear cookies
 * @access Public (works even without valid token)
 */
router.post('/logout', logout);

/**
 * @route  GET /api/auth/verify
 * @desc   Verify current token and return user info (SSO check endpoint)
 * @access Protected
 */
router.get('/verify', requireAuth, verify);

/**
 * @route  POST /api/auth/refresh
 * @desc   Exchange refresh token for a new access token (token rotation)
 * @access Protected by refresh cookie
 */
router.post('/refresh', refresh);

/**
 * @route  POST /api/auth/register
 * @desc   Daftarkan user baru sebagai siswa
 * @access Public
 */
router.post('/register', register);

export default router;
