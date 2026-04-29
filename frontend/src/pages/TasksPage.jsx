import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import StatusBadge from "../Components/StatusBadge";
import { useAuth } from "../context/AuthContext";
import { useAsyncAction } from "../hooks/useAsyncAction";

const statusColumns = ["todo", "in-progress", "done"];

const TasksPage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamUsers, setTeamUsers] = useState([]);
  const [loadingPage, setLoadingPage] = useState(true);
  const [pageError, setPageError] = useState("");
  const { loading, error, setError, run } = useAsyncAction();

  const loadPage = async () => {
    try {
      const requests = [api.get("/tasks"), api.get("/projects")];

      if (user.role === "admin") {
        requests.push(api.get("/users"));
      }

      const [tasksResponse, projectsResponse, usersResponse] = await Promise.all(requests);
      setTasks(tasksResponse.data);
      setProjects(projectsResponse.data);
      setTeamUsers(usersResponse?.data || []);
    } catch (err) {
      setPageError(err.response?.data?.msg || "Failed to load tasks");
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    loadPage();
  }, [user.role]);

  const groupedTasks = useMemo(
    () =>
      statusColumns.map((status) => ({
        status,
        tasks: tasks.filter((task) => task.status === status),
      })),
    [tasks]
  );

  const handleCreateTask = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await run(() =>
        api.post("/tasks", {
          title: formData.get("title"),
          description: formData.get("description"),
          projectId: formData.get("projectId"),
          assignedTo: formData.get("assignedTo"),
          dueDate: formData.get("dueDate"),
          status: formData.get("status"),
        })
      );
      event.currentTarget.reset();
      setError("");
      await loadPage();
    } catch (err) {
      // Error state handled by hook.
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      await loadPage();
    } catch (err) {
      setPageError(err.response?.data?.msg || "Failed to update task");
    }
  };

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Tasks</h2>
            <p>
              {user.role === "admin"
                ? "Admins can assign work to anyone in their team."
                : "Members only receive and update their assigned tasks."}
            </p>
          </div>
        </div>

        {user.role === "admin" ? (
          <form className="task-form" onSubmit={handleCreateTask}>
            <input name="title" type="text" placeholder="Task title" required />
            <input name="description" type="text" placeholder="Description" />
            <select name="projectId" defaultValue="" required>
              <option value="" disabled>
                Select project
              </option>
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name}
                </option>
              ))}
            </select>
            <select name="assignedTo" defaultValue="" required>
              <option value="" disabled>
                Assign to
              </option>
              {teamUsers.map((member) => (
                <option key={member._id} value={member._id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </select>
            <select name="status" defaultValue="todo">
              <option value="todo">todo</option>
              <option value="in-progress">in-progress</option>
              <option value="done">done</option>
            </select>
            <input name="dueDate" type="date" required />
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Saving..." : "Create task"}
            </button>
          </form>
        ) : null}

        {error ? <p className="error-text">{error}</p> : null}
        {pageError ? <p className="error-text">{pageError}</p> : null}
      </section>

      {loadingPage ? (
        <div className="screen-center">Loading tasks...</div>
      ) : (
        <section className="kanban-grid">
          {groupedTasks.map((column) => (
            <div key={column.status} className="kanban-column">
              <div className="kanban-header">
                <h3>{column.status}</h3>
                <span>{column.tasks.length}</span>
              </div>
              <div className="kanban-list">
                {column.tasks.map((task) => (
                  <article key={task._id} className="task-card">
                    <div className="task-card-head">
                      <h4>{task.title}</h4>
                      <StatusBadge status={task.status} />
                    </div>
                    <p>{task.description || "No description provided."}</p>
                    <div className="task-meta">
                      <span>Project: {task.projectId?.name || "Unknown"}</span>
                      <span>Assignee: {task.assignedTo?.name || "Unknown"}</span>
                      <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    {(user.role === "member" || user.role === "admin") && (
                      <label className="status-select">
                        Update status
                        <select
                          value={task.status}
                          onChange={(event) => handleStatusChange(task._id, event.target.value)}
                        >
                          {statusColumns.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </label>
                    )}
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};

export default TasksPage;
