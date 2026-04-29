import express from "express";
import { createProject, getProjects } from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";
import { checkRole } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").post(checkRole(["admin"]), createProject).get(getProjects);

export default router;
