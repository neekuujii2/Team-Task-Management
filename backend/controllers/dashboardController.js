import { Task } from "../models/Task.js";
import { getTeamObjectId } from "../utils/team.js";

const buildDashboardQuery = (user) => {
  const teamObjectId = getTeamObjectId(user.teamId);
  if (!teamObjectId) {
    return null;
  }

  const query = { teamId: teamObjectId };

  if (user.role === "member") {
    query.assignedTo = user.id;
  }

  return query;
};

export const getDashboardSummary = async (req, res) => {
  try {
    const query = buildDashboardQuery(req.user);
    if (!query) {
      return res.json({
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
      });
    }

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
