import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children, role }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token) return <Navigate to="/login" />;
  if (role && (!user || !user.roles.includes(role))) return <Navigate to="/todos" />;
  return children;
} 