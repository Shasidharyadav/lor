// src/pages/AdminDashboard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import StatsCard from '../components/Dashboard/StatsCard';
import "../styles/global.css";
import "../styles/AdminDashboard.css";
import addUserImg from "../assets/add_user1.png";


const AdminDashboard = () => {
  document.title = 'Admin Dashboard';
  const navigate = useNavigate();


  const user = JSON.parse(localStorage.getItem('user')) || {};


  // ---------------------------------------
  // DEPARTMENT_ADMIN VIEW
  // Just two cards: "Add HOD" and "LoR Requests"
  // ---------------------------------------
  if (user.role === 'department_admin') {
    const handleNavigateManageHOD = () => navigate('/admin/manage-hod');
    const handleNavigateFaculty = () => navigate('/admin/manage-faculty');
    const handleNavigateStudents = () => navigate('/admin/manage-students');


    return (
      <DashboardLayout role={user.role} user={user}>
      <h2>Department Admin Dashboard</h2>

      {/* 2 Stats Cards with onClick navigation */}
      <div className="stats-grid">
        <StatsCard
        title="Manage HOD"
        onClick={handleNavigateManageHOD}
        img={addUserImg}
        />
        <StatsCard
        title="Manage Faculty"
        onClick={handleNavigateFaculty}
        img={addUserImg}
        />
        <StatsCard
        title="Manage Students"
        onClick={handleNavigateStudents}
        img={addUserImg}
        />
      </div>
      </DashboardLayout>
    );
  }

  // ---------------------------------------
  // ADMIN VIEW
  // Show full stats, distribution tables, charts, etc.
  // ---------------------------------------

  // Navigation Handlers for the Stats Cards
  const handleNavigateStudents = () => navigate('/admin/manage-students');
  const handleNavigateFaculty = () => navigate('/admin/manage-faculty');
  const handleNavigateDeptAdmin = () => navigate('/admin/add-user');
  const handleNavigateHoI = () => navigate('/admin/manage-hoi');
  const handleNavigateHoD = () => navigate('/admin/manage-hod');


  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>Admin Dashboard</h2>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatsCard
          title="Manage Faculty"
          onClick={handleNavigateFaculty}
          img={addUserImg}
        />
        <StatsCard
          title="Manage Students"
          onClick={handleNavigateStudents}
          img={addUserImg}
        />
        <StatsCard
          title="Manage Dept. Admin"
          onClick={handleNavigateDeptAdmin}
          img={addUserImg}
        />
        <StatsCard
          title="Manage HoI"
          onClick={handleNavigateHoI}
          img={addUserImg}
        />
        <StatsCard
          title="Manage HoD"
          onClick={handleNavigateHoD}
          img={addUserImg}
        />
        
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
