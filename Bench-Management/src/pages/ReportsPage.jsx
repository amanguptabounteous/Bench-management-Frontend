import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClinet"; // Assuming this is your configured axios client
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUserShield, faChalkboardTeacher, faSpinner } from '@fortawesome/free-solid-svg-icons';
import "./SignIn.css";

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
            const endpoint =
                role === "admin" ? "/bms/admin/login" :
                role === "trainer" ? "/bms/trainer/login" :
                null;

            if (!endpoint) {
                setError("Invalid role selected.");
                setLoading(false);
                return;
            }

            const payload = { email, password };
            const res = await apiClient.post(endpoint, payload);

            if (res.data?.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", role);

                if (role === "admin") {
                    navigate("/home");
                } else {
                    navigate("/assessmentcomp");
                }
            } else {
                setError("Invalid response from server. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials and try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signin-page">
            <div className="signin-container">
                {/* Left Panel: Image */}
                <div className="signin-branding">
                    {/* This panel now only contains the background image via CSS */}
                </div>

                {/* Right Panel: Sign-In Form */}
                <div className="signin-form-container">
                    <form className="signin-form" onSubmit={handleSubmit}>
                        <h2 className="form-title">Welcome Back</h2>
                        <p className="form-subtitle">Please sign in to your account</p>

                        {/* Role Selector */}
                        <div className="role-selector">
                            <button
                                type="button"
                                className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                                onClick={() => setRole('admin')}
                            >
                                <FontAwesomeIcon icon={faUserShield} className="role-icon" />
                                Admin
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${role === 'trainer' ? 'active' : ''}`}
                                onClick={() => setRole('trainer')}
                            >
                                <FontAwesomeIcon icon={faChalkboardTeacher} className="role-icon" />
                                Trainer
                            </button>
                        </div>

                        {/* Email Input */}
                        <div className="input-group">
                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Email Address"
                                className="signin-input"
                            />
                        </div>

                        {/* Password Input */}
                        <div className="input-group">
                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Password"
                                className="signin-input"
                            />
                        </div>

                        {/* Error Message */}
                        {error && <div className="signin-error">{error}</div>}

                        {/* Submit Button */}
                        <button type="submit" className="signin-button" disabled={loading}>
                            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Sign In"}
                        </button>

                        <p className="form-footer">
                            &copy; {new Date().getFullYear()} Bounteous. All Rights Reserved.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
