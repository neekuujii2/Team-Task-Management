import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAsyncAction } from "../hooks/useAsyncAction";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { loading, error, run } = useAsyncAction();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    try {
      await run(() =>
        login({
          email: formData.get("email"),
          password: formData.get("password"),
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
        <p className="eyebrow">Mini SaaS Delivery</p>
        <h1>Keep each team&apos;s work isolated, visible, and moving.</h1>
        <p>
          Sign in as an admin to create projects and assign tasks, or as a member
          to update only the work assigned to you.
        </p>
        <div className="seed-card">
          <strong>Demo accounts</strong>
          <span>Admin dashboard: admin@team1.com / 123456</span>
          <span>Member dashboard: member@team1.com / 123456</span>
        </div>
      </section>

      <section className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Email
            <input name="email" type="email" placeholder="admin@team1.com" required />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="123456" required />
          </label>
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="auth-footer">
          New team member? <Link to="/signup">Create an account</Link>
        </p>
      </section>
    </div>
  );
};

export default LoginPage;
