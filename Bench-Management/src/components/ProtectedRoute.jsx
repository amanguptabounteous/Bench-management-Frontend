import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext'; // Custom hook to access auth context

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        // User not logged in, redirect to signin page
        return <Navigate to="/signin" />;
    }

    // Check if user's role is in the list of allowed roles
    const isAuthorized = allowedRoles.includes(user.role);

    return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" />;
};

export default ProtectedRoute;