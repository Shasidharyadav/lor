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
import ForgotPassword from './components/Auth/ForgotPassword';
import ChangePassword from './components/Auth/ChangePassword';
import Profile from './components/Auth/Profile'; 
import ViewLoRRequest from './pages/ViewLoRRequest';
import GenerateLOR from './pages/generateLOR';
import LoRRequests from './pages/LoRRequests';
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

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
          path="/dashboard/student/view-requests"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <LoRRequests />
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
        <Route
          path="/dashboard/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student/change-password"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route 
        path="/view-lor-request/:requestId" 
        element={
         <ProtectedRoute allowedRoles={['student']}>
              <ViewLoRRequest />
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
        <Route
          path="/dashboard/teacher/profile"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/teacher/change-password"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
        path="/dashboard/teacher/lor-request/:requestId"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
              <ViewLoRRequest />
            </ProtectedRoute>
            }
            />
        <Route 
        path="/view-lor-request/:requestId" 
        element={
         <ProtectedRoute allowedRoles={['teacher']}>
              <ViewLoRRequest />
            </ProtectedRoute>
        }
           />
        <Route
          path="/accepted-requests/generate-lor/:requestId"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <GenerateLOR />
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
        <Route
          path="/dashboard/admin/profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin/change-password"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
