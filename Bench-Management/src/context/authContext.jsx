import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService'; // <-- Import your service

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Initialize state directly from what's in localStorage
    const [user, setUser] = useState(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');
        return token && role ? { token, role } : null;
    });

    const navigate = useNavigate();

    // The login function now calls your service
    const login = async (email, password, role) => {
        try {
            const data = await authService.login(email, password, role);
            // On success, update the context's state
            setUser({ token: data.token, role: role });
            // Let the component handle navigation
            return data; 
        } catch (error) {
            // Let the component handle the error message
            throw error; 
        }
    };

    // The logout function now calls your service
    const logout = () => {
        authService.logout();
        setUser(null);
        navigate('/signin');
    };

    const value = { user, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook remains the same
export const useAuth = () => {
    return useContext(AuthContext);
};