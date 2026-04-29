import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AppShell = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Task & Project Hub</p>
          <h1>Team workspace</h1>
          <p className="sidebar-copy">
            RBAC-enabled planning for {user.teamId}. Admins coordinate the backlog,
            members move their work forward.
          </p>
        </div>

        <nav className="nav-list">
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/tasks">Tasks</NavLink>
        </nav>

        <div className="profile-card">
          <span className="role-pill">{user.role}</span>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
          <span>Team ID: {user.teamId}</span>
          <button className="ghost-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="content-area">
        <Outlet />
      </main>
    </div>
  );
};

export default AppShell;
