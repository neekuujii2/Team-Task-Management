import { Task } from "../models/Task.js";

const buildDashboardQuery = (user) => {
  const query = { teamId: user.teamId };

  if (user.role === "member") {
    query.assignedTo = user.id;
  }

  return query;
};

export const getDashboardSummary = async (req, res) => {
  try {
    const query = buildDashboardQuery(req.user);
    const now = new Date();

    const [totalTasks, completedTasks, pendingTasks, overdueTasks] = await Promise.all([
      Task.countDocuments(query),
      Task.countDocuments({ ...query, status: "done" }),
      Task.countDocuments({ ...query, status: { $ne: "done" } }),
      Task.countDocuments({
        ...query,
        status: { $ne: "done" },
        dueDate: { $lt: now },
      }),
    ]);

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    });
  } catch (error) {
    res.status(500).json({ msg: "Failed to load dashboard", error: error.message });
  }
};
