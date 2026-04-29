import express from "express";
import { createTask, getTasks, updateTask } from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").post(checkRole(["admin"]), createTask).get(getTasks);
router.put("/:id", checkRole(["admin", "member"]), updateTask);

export default router;
