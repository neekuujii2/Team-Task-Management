import { Project } from "../models/Project.js";
import { getTeamObjectId } from "../utils/team.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const teamObjectId = getTeamObjectId(req.user.teamId);

    if (!name) {
      return res.status(400).json({ msg: "Project name is required" });
    }

    if (!teamObjectId) {
      return res.status(400).json({ msg: "Invalid team context" });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      teamId: teamObjectId,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ msg: "Failed to create project", error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const teamObjectId = getTeamObjectId(req.user.teamId);

    if (!teamObjectId) {
      return res.json([]);
    }

    const projects = await Project.find({ teamId: teamObjectId })
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch projects", error: error.message });
  }
};
