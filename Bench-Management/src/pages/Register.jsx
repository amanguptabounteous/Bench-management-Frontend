import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignIn.css"; // Reuse SignIn styles for consistency

const Register = () => {
  const [name, setName] = useState("");
  const [empId, setEmpId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Replace with your backend registration endpoint
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, empId, email, password }),
      });
      if (!response.ok) throw new Error("Registration failed");
      setMessage("Registration successful! Please sign in.");
      setTimeout(() => navigate("/signin"), 1500);
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  return (
    <div className="signin-background">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2 className="signin-title">Sign Up</h2>
        {message && <div className="signin-error">{message}</div>}
        <label htmlFor="name" className="signin-label">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="signin-input"
        />
        <label htmlFor="empId" className="signin-label">
          Employee ID
        </label>
        <input
          id="empId"
          type="text"
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          required
          className="signin-input"
        />
        <label htmlFor="email" className="signin-label">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="signin-input"
        />
        <label htmlFor="password" className="signin-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="signin-input"
        />
        <button type="submit" className="signin-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Register;