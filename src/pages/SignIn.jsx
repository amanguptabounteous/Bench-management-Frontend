import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClinet";
import "./SignIn.css";
import loadingVideo from "../assets/loading.mp4";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await apiClient.post("/auth/login", { email, password, role });
      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", role);
        if (role === "admin") {
          navigate("/admin-dashboard");
        } else if (role === "trainer") {
          navigate("/trainer-dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError("Invalid response from server.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-background">
      <video
        className="signin-bg-video"
        src={loadingVideo}
        autoPlay
        loop
        muted
        playsInline
      />
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2 className="signin-title">Sign In</h2>

        <div className="signin-role-group">
          <button
            type="button"
            className={`signin-role-btn${role === "admin" ? " selected" : ""}`}
            onClick={() => setRole("admin")}
            tabIndex={0}
          >
            Admin
          </button>
          <button
            type="button"
            className={`signin-role-btn${role === "trainer" ? " selected" : ""}`}
            onClick={() => setRole("trainer")}
            tabIndex={0}
          >
            Trainer
          </button>
        </div>

        <label htmlFor="email" className="signin-label">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="signin-input"
        />

        <label htmlFor="password" className="signin-label">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="signin-input"
        />

        <button type="submit" className="signin-button" disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </button>
        {error && <div className="signin-error">{error}</div>}
      </form>
    </div>
  );
};

export default SignIn;