import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAsyncAction } from "../hooks/useAsyncAction";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const { loading, error, run } = useAsyncAction();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await run(() =>
        signup({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
          role: formData.get("role"),
          teamId: formData.get("teamId"),
        })
      );
      navigate("/dashboard");
    } catch (err) {
      // Error state is handled in the hook.
    }
  };

  return (
    <div className="auth-layout">
      <section className="auth-hero">
        <p className="eyebrow">Team-Based Access</p>
        <h1>Create a workspace identity with role and team isolation.</h1>
        <p>
          Every signup includes a `teamId`, which the backend uses to isolate
          projects, tasks, and dashboard metrics.
        </p>
      </section>

      <section className="auth-card">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Name
            <input name="name" type="text" placeholder="Jane Admin" required />
          </label>
          <label>
            Email
            <input name="email" type="email" placeholder="jane@team.com" required />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="Minimum 6 characters" required />
          </label>
          <label>
            Role
            <select name="role" defaultValue="member">
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </label>
          <label>
            Team ID
            <input name="teamId" type="text" placeholder="TEAM_ABC_001" required />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>
        <p className="auth-footer">
          Already signed up? <Link to="/login">Back to login</Link>
        </p>
      </section>
    </div>
  );
};

export default SignupPage;
