import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ChangePassword from './components/Auth/ChangePassword';
import Profile from './components/Auth/Profile';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplyLoR from './pages/ApplyLoR';
import AcceptLoR from './pages/AcceptLoR';
import PendingRequests from './pages/PendingRequests';
import AcceptedRequests from './pages/AcceptedRequests';
import ManageUsers from './pages/ManageUsers';
import GenerateReports from './pages/GenerateReports';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import { isAuthenticated } from './utilities/auth';
import './styles/global.css'; 

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/dashboard/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>} />
        <Route path="/apply-lor" element={<ProtectedRoute><ApplyLoR /></ProtectedRoute>} />
        <Route path="/pending-requests" element={<ProtectedRoute><PendingRequests /></ProtectedRoute>} />
        <Route path="/accepted-requests" element={<ProtectedRoute><AcceptedRequests /></ProtectedRoute>} />

        {/* Teacher Routes */}
        <Route path="/dashboard/teacher" element={<ProtectedRoute><TeacherDashboard /></ProtectedRoute>} />
        <Route path="/accept-lor" element={<ProtectedRoute><AcceptLoR /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/dashboard/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/manage-users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />
        <Route path="/generate-reports" element={<ProtectedRoute><GenerateReports /></ProtectedRoute>} />

        {/* Default Route */}
        <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard/student" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;
