import { Project } from "../models/Project.js";

export const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ msg: "Project name is required" });
    }

    const project = await Project.create({
      name,
      description,
      createdBy: req.user.id,
      teamId: req.user.teamId,
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ msg: "Failed to create project", error: error.message });
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ teamId: req.user.teamId })
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch projects", error: error.message });
  }
};
