import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import examRouter from './routes/exam.js';
import { initUsersTable } from './models/User.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.AUTH_PORT || 5001;

/* ─── Allowed Origins (SSO: list all your apps) ───── */
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://192.168.69.252:5173,http://tst.lan:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true, // Required for cookies to be sent cross-origin
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ─── Routes ───────────────────────────────────────── */
app.use('/api/auth', authRoutes);
app.use('/api/exams', examRouter);
/* ─── Health Check ─────────────────────────────────── */
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'auth-server',
    timestamp: new Date().toISOString(),
  });
});

/* ─── 404 Handler ──────────────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ─── Global Error Handler ─────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

/* ─── Start Server ─────────────────────────────────── */
async function start() {
  try {
    await initUsersTable();
    app.listen(PORT, () => {
      console.log(`🚀 Auth Server running on http://tst.lan:${PORT}`);
      console.log(`   Allowed origins: ${allowedOrigins.join(', ')}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
}

start();
