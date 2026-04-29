import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const createToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      teamId: user.teamId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  teamId: user.teamId,
});

export const signup = async (req, res) => {
  try {
    const { name, email, password, role, teamId } = req.body;

    if (!name || !email || !password || !role || !teamId) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = await User.create({ name, email, password, role, teamId });
    const token = createToken(user);

    res.status(201).json({
      msg: "Signup successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to signup", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid credentials" });
    }

    const token = createToken(user);

    res.json({
      msg: "Login successful",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to login", error: error.message });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ user: sanitizeUser(user) });
  } catch (error) {
    res.status(500).json({ msg: "Failed to load user", error: error.message });
  }
};
