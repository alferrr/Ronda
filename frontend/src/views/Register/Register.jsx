import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../controllers/useAuth";
import "./Register.css";

const Register = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "resident",
    barangay: "",
    phone: "",
  });
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/login", { state: { registered: true } });
    } catch {
      // error handled by hook
    }
  };

  return (
    <div className="register">
      <div className="register__brand">
        <h1>Ronda</h1>
      </div>

      <div className="register__card">
        <div className="register__head">
          <h2>Create an account</h2>
          <p>Join the barangay safety network</p>
        </div>

        <form className="register__form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Juan dela Cruz"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              value={form.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={form.role}
                onChange={handleChange}
              >
                <option value="resident">Resident</option>
                <option value="official">Barangay Official</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone (optional)</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="09XX XXX XXXX"
                value={form.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="barangay">Barangay (optional)</label>
            <input
              id="barangay"
              name="barangay"
              type="text"
              placeholder="e.g. Lahug, Mabolo"
              value={form.barangay}
              onChange={handleChange}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="register__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
