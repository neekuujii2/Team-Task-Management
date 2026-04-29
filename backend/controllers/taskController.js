import mongoose from "mongoose";
import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";
import { User } from "../models/User.js";

const buildTaskQuery = (user) => {
  const query = { teamId: user.teamId };

  if (user.role === "member") {
    query.assignedTo = user.id;
  }

  return query;
};

export const createTask = async (req, res) => {
  try {
    const { title, description, status, assignedTo, projectId, dueDate } = req.body;

    if (!title || !assignedTo || !projectId || !dueDate) {
      return res.status(400).json({ msg: "Missing required task fields" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(assignedTo) ||
      !mongoose.Types.ObjectId.isValid(projectId)
    ) {
      return res.status(400).json({ msg: "Invalid project or assignee id" });
    }

    const [project, assignee] = await Promise.all([
      Project.findOne({ _id: projectId, teamId: req.user.teamId }),
      User.findOne({ _id: assignedTo, teamId: req.user.teamId }),
    ]);

    if (!project) {
      return res.status(404).json({ msg: "Project not found for this team" });
    }

    if (!assignee) {
      return res.status(404).json({ msg: "Assignee not found for this team" });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "todo",
      assignedTo,
      projectId,
      dueDate,
      teamId: req.user.teamId,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role teamId")
      .populate("projectId", "name description");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(500).json({ msg: "Failed to create task", error: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(buildTaskQuery(req.user))
      .populate("assignedTo", "name email role")
      .populate("projectId", "name description")
      .sort({ dueDate: 1, createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch tasks", error: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const query = { _id: req.params.id, teamId: req.user.teamId };

    if (req.user.role === "member") {
      query.assignedTo = req.user.id;
    }

    const task = await Task.findOne(query);
    if (!task) {
      return res.status(404).json({ msg: "Task not found" });
    }

    if (req.user.role === "member") {
      const allowedFields = ["status"];
      const incomingFields = Object.keys(req.body);
      const invalidField = incomingFields.find((field) => !allowedFields.includes(field));

      if (invalidField) {
        return res.status(403).json({ msg: "Members can update status only" });
      }

      if (!["todo", "in-progress", "done"].includes(req.body.status)) {
        return res.status(400).json({ msg: "Invalid status value" });
      }

      task.status = req.body.status;
    } else {
      const { title, description, status, assignedTo, projectId, dueDate } = req.body;

      if (assignedTo) {
        const assignee = await User.findOne({ _id: assignedTo, teamId: req.user.teamId });
        if (!assignee) {
          return res.status(404).json({ msg: "Assignee not found for this team" });
        }
        task.assignedTo = assignedTo;
      }

      if (projectId) {
        const project = await Project.findOne({ _id: projectId, teamId: req.user.teamId });
        if (!project) {
          return res.status(404).json({ msg: "Project not found for this team" });
        }
        task.projectId = projectId;
      }

      if (title !== undefined) task.title = title;
      if (description !== undefined) task.description = description;
      if (status !== undefined) task.status = status;
      if (dueDate !== undefined) task.dueDate = dueDate;
    }

    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("projectId", "name description");

    res.json(populatedTask);
  } catch (error) {
    res.status(500).json({ msg: "Failed to update task", error: error.message });
  }
};
