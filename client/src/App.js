import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TodosPage from './pages/TodosPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import RequireAuth from './components/RequireAuth';
import NavBar from './components/NavBar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/todos" element={<RequireAuth><NavBar /><TodosPage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><NavBar /><ProfilePage /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth role="admin"><NavBar /><AdminPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
