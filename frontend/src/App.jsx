// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Components
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import ChangePassword from './components/Auth/ChangePassword';
import Profile from './components/Auth/Profile';

// Shared / Guards
import ProtectedRoute from './components/Shared/ProtectedRoute';

// Student Pages
import StudentDashboard from './pages/StudentDashboard';
import ApplyLoR from './pages/ApplyLoR';
import LoRRequests from './pages/LoRRequests'; 
import PendingRequests from './pages/PendingRequests';
import AcceptedRequests from './pages/AcceptedRequests';
import FacultyProfiles from './pages/FacultyProfiles';
import ViewLoRRequest from './pages/ViewLoRRequest';

// Teacher Pages
import TeacherDashboard from './pages/FacultyDashboard'; // or rename to TeacherDashboard
import AcceptLoR from './pages/AcceptLoR';
import GenerateLOR from './pages/generateLOR';
import RequestLoRDeletion from './pages/RequestLoRDeletion';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import GenerateReports from './pages/admin/GenerateReports';
import AllStudentsPage from './pages/admin/AllStudentsPage';
import AllFacultyPage from './pages/admin/AllFacultyPage';
import AllUsersPage from './pages/admin/AllUsersPage';
import ManageUsersPage from './pages/admin/ManageUsers';
import GenerateReportsPage from './pages/admin/GenerateReports';
import AddUser from './pages/admin/AddUser';
import ManageLoRRequests from './pages/admin/ManageLoRRequests';
import ViewAnalysis from './pages/admin/ViewAnalysis';
import ManageHoI from './pages/admin/ManageHoI';
import ManageHoD from './pages/admin/ManageHoD';
import DeleteLoRRequest from './pages/admin/DeleteLoRRequest';
import AddUserPage from './pages/admin/AddUserPage';
// Global CSS
import './styles/global.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* -------------------- Authentication Routes -------------------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />


        {/* -------------------- Student Routes -------------------- */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/apply-lor"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ApplyLoR />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/view-requests"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <LoRRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/pending-requests"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <PendingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/accepted-requests"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <AcceptedRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/faculty-profiles"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <FacultyProfiles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/change-password"
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/student/view-lor-request/:requestId" 
          element={
            <ProtectedRoute allowedRoles={['student']}>
              <ViewLoRRequest />
            </ProtectedRoute>
          }
        />

        {/* -------------------- Teacher Routes -------------------- */}
        <Route
          path="/teacher/dashboard"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/accept-lor"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <LoRRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/pending-requests"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <PendingRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/accepted-requests"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <AcceptedRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/request-lor-delete"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <RequestLoRDeletion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/profile"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/change-password"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/view-lor-request/:requestId"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <ViewLoRRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teacher/generate-lor/:requestId"
          element={
            <ProtectedRoute allowedRoles={['teacher']}>
              <GenerateLOR />
            </ProtectedRoute>
          }
        />

        {/* -------------------- Admin Routes -------------------- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin','department_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-hod"
          element={
            <ProtectedRoute allowedRoles={['department_admin', 'admin']}>
              <ManageHoD />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/Lor-request"
          element={
            <ProtectedRoute allowedRoles={['department_admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
         path='/admin/delete-lor-request'
          element={
            <ProtectedRoute allowedRoles={['department_admin', 'admin']}>
              <DeleteLoRRequest />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute allowedRoles={['admin','department_admin']}>
              <AddUserPage />
            </ProtectedRoute>
          }
        />
        <Route
        path="/admin/all-students"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AllStudentsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/all-faculty"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AllFacultyPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/all-users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AllUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-hoi"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageHoI />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/manage-users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ManageUsersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/generate-reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <GenerateReportsPage />
          </ProtectedRoute>
        }
      />
        <Route
          path="/admin/manage-users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/generate-reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <GenerateReports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-user"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AddUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-lor-requests"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageLoRRequests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/view-analysis"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ViewAnalysis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/change-password"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

        {/* -------------------- Default Route -------------------- */}
        <Route path="/" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
};

export default App;
