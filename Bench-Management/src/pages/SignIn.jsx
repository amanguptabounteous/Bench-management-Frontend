import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClinet"; // Assuming this is your configured axios client
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faUserShield, faChalkboardTeacher, faSpinner, faIdCard, faUser } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../context/authContext"; // Custom hook to access auth context
import "./SignIn.css";

// URL for the combined white logo
const logoUrl = "https://dgq6zoj2w3e86.cloudfront.net/sponsors/Bounteous_logo.png";

const SignIn = () => {
    // Common state
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("admin");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    // State for toggling between Login and Register
    const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

    // State for registration form
    const [name, setName] = useState("");
    const [empId, setEmpId] = useState("");


    const handleRoleChange = (newRole) => {
        setRole(newRole);
        // Reset form when role changes
        setAuthMode('login');
        setError('');
        setSuccessMessage('');
        setEmail('');
        setPassword('');
        setName('');
        setEmpId('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        // Handle Registration
        if (authMode === 'register' && role === 'trainer') {
            try {
                const payload = { empId: Number(empId), name, email, password };
                await apiClient.post('/bms/trainer/register', payload);
                setSuccessMessage("Registration successful! Please log in.");
                setAuthMode('login'); // Switch back to login view
                // Clear registration fields
                setName('');
                setEmpId('');
                setPassword('');

            } catch (err) {
                setError(err.response?.data?.message || "Registration failed. Please try again.");
            } finally {
                setLoading(false);
            }
            return; // End execution for registration
        }

        // Handle Login
        try {
            await login(email, password, role); // <-- Call the context's login function

            // On successful login, navigate
            if (role === "admin") {
                navigate("/home");
            } else {
                navigate("/assessmentcomp");
            }
        } catch (err) {
            // The context throws the error, so we can catch it here
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const isRegisterMode = authMode === 'register' && role === 'trainer';

    return (
        <div className="signin-page">
            <div className="signin-container">
                {/* Left Panel: Image and Logo */}
                <div className="signin-branding">
                    <img src={logoUrl} alt="Bounteous x Accolite Logo" className="branding-logo-combined" />
                </div>

                {/* Right Panel: Sign-In Form */}
                <div className="signin-form-container">
                    <form className="signin-form" onSubmit={handleSubmit}>
                        <h2 className="form-title">{isRegisterMode ? 'Create Trainer Account' : 'Welcome Back'}</h2>
                        <p className="form-subtitle">{isRegisterMode ? 'Get started by creating your account' : 'Please sign in to your account'}</p>

                        {/* Role Selector */}
                        <div className="role-selector">
                            <button
                                type="button"
                                className={`role-btn ${role === 'admin' ? 'active' : ''}`}
                                onClick={() => handleRoleChange('admin')}
                            >
                                <FontAwesomeIcon icon={faUserShield} className="role-icon" />
                                Admin
                            </button>
                            <button
                                type="button"
                                className={`role-btn ${role === 'trainer' ? 'active' : ''}`}
                                onClick={() => handleRoleChange('trainer')}
                            >
                                <FontAwesomeIcon icon={faChalkboardTeacher} className="role-icon" />
                                Trainer
                            </button>
                        </div>

                        {/* Registration Fields (conditional) */}
                        {isRegisterMode && (
                            <>
                                <div className="input-group">
                                    <FontAwesomeIcon icon={faIdCard} className="input-icon" />
                                    <input id="empId" type="number" value={empId} onChange={(e) => setEmpId(e.target.value)} required placeholder="Employee ID" className="signin-input" />
                                </div>
                                <div className="input-group">
                                    <FontAwesomeIcon icon={faUser} className="input-icon" />
                                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Full Name" className="signin-input" />
                                </div>
                            </>
                        )}

                        {/* Common Fields */}
                        <div className="input-group">
                            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email Address" className="signin-input" />
                        </div>
                        <div className="input-group">
                            <FontAwesomeIcon icon={faLock} className="input-icon" />
                            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" className="signin-input" />
                        </div>

                        {/* Messages */}
                        {error && <div className="signin-error">{error}</div>}
                        {successMessage && <div className="signin-success">{successMessage}</div>}

                        {/* Submit Button */}
                        <button type="submit" className="signin-button" disabled={loading}>
                            {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : (isRegisterMode ? 'Register' : 'Sign In')}
                        </button>

                        {/* Toggle between Login/Register */}
                        {role === 'trainer' && (
                            <p className="auth-toggle">
                                {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}
                                <button type="button" onClick={() => setAuthMode(isRegisterMode ? 'login' : 'register')} className="auth-toggle-btn">
                                    {isRegisterMode ? 'Sign In' : 'Register'}
                                </button>
                            </p>
                        )}

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
