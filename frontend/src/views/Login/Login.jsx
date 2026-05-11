import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../controllers/useAuth";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      if (user.role === "official") {
        navigate("/official/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch {
      // error is handled by the hook
    }
  };

  return (
    <div className="login">
      <div className="login__brand">
        <h1>Ronda</h1>
      </div>

      <div className="login__card">
        <div className="login__head">
          <h2>Welcome back</h2>
          <p>Sign in to keep the community safe</p>
        </div>

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="login__footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
