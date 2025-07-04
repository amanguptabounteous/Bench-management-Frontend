// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./SignIn.css";

// const SignIn = () => {
//   const [userId, setUserId] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Add authentication logic here
//     navigate("/home");
//   };

//   return (
//     <div className="signin-background">
//       <form className="signin-form" onSubmit={handleSubmit}>
//         <h2 className="signin-title">Sign In</h2>
//         <label htmlFor="userId" className="signin-label">
//           User ID
//         </label>
//         <input
//           id="userId"
//           type="text"
//           value={userId}
//           onChange={(e) => setUserId(e.target.value)}
//           required
//           className="signin-input"
//         />
//         <label htmlFor="password" className="signin-label">
//           Password
//         </label>
//         <input
//           id="password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//           className="signin-input"
//         />
//         <button type="submit" className="signin-button">
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// };

// export default SignIn;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignIn.css";

const SignIn = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Make POST request to backend login endpoint
      const response = await axios.post("http://localhost:8080/api/auth/signin", {
        userId,
        password
      });

      // Assuming backend returns: { token: "..." }
      const token = response.data.token;
      localStorage.setItem("token", token);

      // Redirect to home
      navigate("/home");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-background">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2 className="signin-title">Sign In</h2>
        
        <label htmlFor="userId" className="signin-label">User ID</label>
        <input
          id="userId"
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
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
      </form>
    </div>
  );
};

export default SignIn;
