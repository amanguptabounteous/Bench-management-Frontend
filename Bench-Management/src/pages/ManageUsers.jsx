import React, { useState } from "react";
import "./ManageUsers.css";
import useBenchData from "../services/useBenchData";

const ManageUsers = () => {
  // Use loading from useBenchData to enforce authentication
  const { loading } = useBenchData();

  const [role, setRole] = useState("admin");
  const [empId, setEmpId] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      // Replace with your backend endpoint
      const response = await fetch("http://localhost:5000/api/users/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, empId, email }),
      });
      if (!response.ok) throw new Error("Failed to add user");
      setMessage("User added successfully!");
      setEmpId("");
      setEmail("");
    } catch (err) {
      setMessage("Error: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <span className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="manage-users-background">
      <form className="manage-users-form" onSubmit={handleSubmit}>
        <h2>Manage Users</h2>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="trainer">Trainer</option>
          </select>
        </label>
        <label>
          Employee ID:
          <input
            type="text"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <button type="submit">Add User</button>
        {message && <div className="manage-users-message">{message}</div>}
      </form>
    </div>
  );
};

export default ManageUsers;