import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password', 'refresh_token'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const Register = async (req, res) => {
  const { name, email, password, confPassword } = req.body;
  
  // Validasi input
  if (!name || !email || !password || !confPassword) {
    return res.status(400).json({ msg: "Semua field harus diisi" });
  }
  
  if (password !== confPassword) {
    return res.status(400).json({ msg: "Password dan Confirm Password tidak sesuai" });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ msg: "Password minimal 6 karakter" });
  }
  
  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({
      where: { email: email }
    });
    
    if (existingUser) {
      return res.status(400).json({ msg: "Email sudah terdaftar" });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    
    await User.create({
      name: name,
      email: email,
      password: hashPassword
    });
    
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Terjadi kesalahan server", error: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({ msg: "Email dan password harus diisi" });
    }
    
    console.log("Login attempt for email:", email); // Debug
    
    const user = await User.findOne({
      where: {
        email: email
      }
    });
    
    console.log("User found:", user ? "Yes" : "No"); // Debug
    
    if (!user) {
      return res.status(404).json({ msg: "Email tidak ditemukan" });
    }
    
    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      return res.status(400).json({ msg: "Password Salah" });
    }
    
    const userId = user.id;
    const name = user.name;
    const userEmail = user.email;

    const accessToken = jwt.sign(
      { userId, name, email: userEmail },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" } // Ubah jadi 15 menit lebih realistis
    );

    const refreshToken = jwt.sign(
      { userId, name, email: userEmail },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    
    await User.update(
      { refresh_token: refreshToken },
      { where: { id: userId } }
    );
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === 'production', // HTTPS only di production
      sameSite: 'strict'
    });
    
    res.json({ 
      msg: "Login berhasil",
      accessToken,
      user: {
        id: userId,
        name: name,
        email: userEmail
      }
    });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ msg: "Terjadi kesalahan server", error: error.message });
  }
};