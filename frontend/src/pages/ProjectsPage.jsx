import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useAsyncAction } from "../hooks/useAsyncAction";

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [pageError, setPageError] = useState("");
  const { loading, error, setError, run } = useAsyncAction();

  const loadProjects = async () => {
    try {
      const { data } = await api.get("/projects");
      setProjects(data);
    } catch (err) {
      setPageError(err.response?.data?.msg || "Failed to load projects");
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await run(() =>
        api.post("/projects", {
          name: formData.get("name"),
          description: formData.get("description"),
        })
      );
      event.currentTarget.reset();
      setError("");
      await loadProjects();
    } catch (err) {
      // Error state handled by hook.
    }
  };

  return (
    <div className="page-stack">
      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Projects</h2>
            <p>Only projects with team ID {user.teamId} are returned by the API.</p>
          </div>
        </div>

        {user.role === "admin" ? (
          <form className="inline-form" onSubmit={handleCreateProject}>
            <input name="name" type="text" placeholder="Project name" required />
            <input name="description" type="text" placeholder="Description" />
            <button type="submit" className="primary-button" disabled={loading}>
              {loading ? "Creating..." : "Create project"}
            </button>
          </form>
        ) : (
          <p className="muted-note">Members can view team projects but cannot create them.</p>
        )}

        {error ? <p className="error-text">{error}</p> : null}
        {pageError ? <p className="error-text">{pageError}</p> : null}

        {loadingProjects ? (
          <div className="screen-center">Loading projects...</div>
        ) : (
          <div className="card-grid">
            {projects.map((project) => (
              <article key={project._id} className="project-card">
                <div>
                  <h3>{project.name}</h3>
                  <p>{project.description || "No description provided."}</p>
                </div>
                <footer>
                  <span>Created by {project.createdBy?.name || "Unknown"}</span>
                  <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                </footer>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProjectsPage;
