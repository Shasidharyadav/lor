import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ProtectedRoute from './components/Shared/ProtectedRoute';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/FacultyDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ApplyLoR from './pages/ApplyLoR';
import AcceptLoR from './pages/AcceptLoR';
import PendingRequests from './pages/PendingRequests';
import AcceptedRequests from './pages/AcceptedRequests';
import ManageUsers from './pages/ManageUsers';
import GenerateReports from './pages/GenerateReports';
import FacultyProfiles from './pages/FacultyProfiles';
import './styles/global.css';

const App = () => {

  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Routes */}
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/apply-lor"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ApplyLoR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/pending-requests"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <PendingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/accepted-requests"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <AcceptedRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/faculty-profiles"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <FacultyProfiles />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/dashboard/teacher"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/accept-lor"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <AcceptLoR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/pending-requests"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <PendingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/accepted-requests"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <AcceptedRequests />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/manage-users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/generate-reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GenerateReports />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
};

export default App;
