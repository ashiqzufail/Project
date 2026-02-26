import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function ProtectedLayout() {
    const token = localStorage.getItem('token');
    const userJson = localStorage.getItem('user');
    const location = useLocation();

    let user = null;
    try {
        user = userJson ? JSON.parse(userJson) : null;
    } catch (e) {
        console.error("Error parsing user from localStorage", e);
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Protection for admin routes
    if (location.pathname.startsWith('/admin') && (!user || user.role !== 'admin')) {
        return <Navigate to="/home" replace />;
    }

    return <Outlet />;
}
