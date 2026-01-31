import express from "express";
import cors from "cors";
import db from "./config/Database.js";

// Import routes
import authRoutes from "./routes/authRoutes.js";
import examRoutes from "./routes/examRoutes.js"; // ← TAMBAHKAN INI

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
try {
    await db.authenticate();
    console.log('✅ Database connected successfully');
} catch (error) {
    console.error('❌ Database connection failed:', error);
}

// Register routes
app.use('/api/auth', authRoutes);  // Routes login yang sudah ada
app.use('/api', examRoutes);        // ← TAMBAHKAN INI (Routes exam baru)

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});