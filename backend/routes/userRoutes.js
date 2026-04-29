import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";
import { User } from "../models/User.js";

const router = express.Router();

router.get("/", protect, checkRole(["admin"]), async (req, res) => {
  try {
    const users = await User.find({ teamId: req.user.teamId }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch users", error: error.message });
  }
});

export default router;
