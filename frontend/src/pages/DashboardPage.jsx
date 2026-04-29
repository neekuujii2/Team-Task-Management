import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [{ data: dashboardData }, { data: tasksData }] = await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/tasks"),
        ]);

        setSummary(dashboardData);
        setRecentTasks(tasksData.slice(0, 5));
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div className="screen-center">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="screen-center error-text">{error}</div>;
  }

  const cards = [
    { label: "Total tasks", value: summary.totalTasks },
    { label: "Completed", value: summary.completedTasks },
    { label: "Pending", value: summary.pendingTasks },
    { label: "Overdue", value: summary.overdueTasks },
  ];

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div>
          <p className="eyebrow">{user.role === "admin" ? "Admin command" : "Member focus"}</p>
          <h2>{user.name}, here’s the current pulse of {user.teamId}.</h2>
          <p>
            {user.role === "admin"
              ? "You can create projects, assign tasks, and monitor every item for your team."
              : "You can review the tasks assigned to you and move them through their statuses."}
          </p>
        </div>
      </section>

      <section className="metric-grid">
        {cards.map((card) => (
          <article key={card.label} className="metric-card">
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h3>Recent tasks</h3>
          <span>{recentTasks.length} visible to you</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Status</th>
                <th>Due date</th>
              </tr>
            </thead>
            <tbody>
              {recentTasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.projectId?.name || "No project"}</td>
                  <td>{task.status}</td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
