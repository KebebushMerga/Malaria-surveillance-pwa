import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-visual-content">
          <img
            src="/malaria-icon.jpg"
            alt="Malaria Surveillance"
            className="login-visual-logo"
          />

          <h1>
            Malaria Surveillance
            System
          </h1>

          <p>
            A digital platform for malaria
            line-list data collection,
            surveillance, analytics and
            reporting.
          </p>

          <p>
            Connecting health facilities
            with timely and reliable
            surveillance information.
          </p>
        </div>
      </section>

      <section className="login-form-section">
        <div className="login-card">
          <div className="login-brand">
            <img
              src="/malaria-icon.jpg"
              alt="Malaria Surveillance"
            />

            <div>
              <h1>
                Malaria Surveillance
              </h1>

              <p>
                Surveillance & Reporting
                System
              </p>
            </div>
          </div>

          <div className="page-header">
            <div>
              <h1>Welcome back</h1>

              <p>
                Sign in to access the
                surveillance system.
              </p>
            </div>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">
                Email address
              </label>

              <input
                id="email"
                className="form-control"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value
                  )
                }
                placeholder="Enter your email"
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                className="form-control"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign In"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;