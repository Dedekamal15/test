import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.json({ message: error.message });
  }
};
export const Register = async (req, res) => {
  const { name, email, password, confPassword, role } = req.body;
  if (password !== confPassword)
    return res
      .status(400)
      .json({ msg: "Password and Confirm Password tidak Ssesuai" });
  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(password, salt);
  try {
    await User.create({
      name: name,
      email: email,
      password: hashPassword
    });
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    console.log("ERROR CUYY");
  }
};

export const Login = async (req, res) => {
  try {
    const user = await User.findAll({
      where: {
        email: req.body.email,
      },
    });
    const match = await bcrypt.compare(req.body.password, user[0].password);
    if (!match) return res.status(400).json({ msg: "Password Salah" });
    const userId = user[0].id;
    const name = user[0].name;
    const email = user[0].email;

    const accessToken = jwt.sign(
      { userId, name, email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "20s" }
    );

    const refreshToken = jwt.sign(
      { userId, name, email },
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
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(400).json({ msg: "Email tidak ditemukan" });
  }
};
