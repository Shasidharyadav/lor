// src/pages/Admin/ManageUsersPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import {
  createDepartmentAdmin,
  updateTeacherStatus
} from '../../services/api';

import {
  campusOptions,
  campusToSchools,
  allDepartments
} from '../../utilities/filterData'; 
// Note: allSpecializations is removed because we don't need it for admin

import '../../styles/global.css';

const ManageUsersPage = () => {
  document.title = "Manage Users | Admin";
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // -------------------------
  // 1) STATE FOR ADD/UPDATE TEACHER STATUS
  // -------------------------
  const [teacherIdForStatus, setTeacherIdForStatus] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('teacher');
  const [statusSuccess, setStatusSuccess] = useState('');
  const [statusError, setStatusError] = useState('');

  // -------------------------
  // 2) STATE FOR CREATING DEPARTMENTAL ADMIN
  // -------------------------
  const [adminFormData, setAdminFormData] = useState({
    // Hard-coded role
    role: 'admin',
    // Basic fields
    id: '',
    name: '',
    gitamEmail: '',
    password: '',
    // For departmental admin
    campus: '',
    school: '',
    department: ''
    // No specialization
  });

  const [createSuccess, setCreateSuccess] = useState('');
  const [createError, setCreateError] = useState('');

  // ----------------------------------------------------------------
  // HANDLER: TEACHER STATUS
  // ----------------------------------------------------------------
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    setStatusError('');
    setStatusSuccess('');

    try {
      // Make sure to pass the teacher ID and new status
      await updateTeacherStatus(teacherIdForStatus.trim(), selectedStatus);
      setStatusSuccess(`Status updated to "${selectedStatus}" successfully!`);
      setTeacherIdForStatus('');
      setSelectedStatus('teacher');
    } catch (err) {
      setStatusError(err.message || 'Failed to update teacher status.');
    }
  };

  // ----------------------------------------------------------------
  // HANDLERS: CREATING DEPARTMENTAL ADMIN
  // ----------------------------------------------------------------
  const handleAdminChange = (e) => {
    const { name, value } = e.target;
    setAdminFormData(prev => ({ ...prev, [name]: value }));
  };

  // For campus, we reset school and department
  const handleCampusChange = (e) => {
    setAdminFormData(prev => ({
      ...prev,
      campus: e.target.value,
      school: '',
      department: ''
    }));
  };

  // For school, we reset department
  const handleSchoolChange = (e) => {
    setAdminFormData(prev => ({
      ...prev,
      school: e.target.value,
      department: ''
    }));
  };

  const handleDepartmentChange = (e) => {
    setAdminFormData(prev => ({
      ...prev,
      department: e.target.value
    }));
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    try {
      await createDepartmentAdmin(adminFormData);
      setCreateSuccess(`Departmental Admin "${adminFormData.name}" created successfully!`);
      // Reset
      setAdminFormData({
        role: 'admin',
        id: '',
        name: '',
        gitamEmail: '',
        password: '',
        campus: '',
        school: '',
        department: ''
      });
    } catch (err) {
      setCreateError(err.message || 'Failed to create departmental admin.');
    }
  };

  return (
    <DashboardLayout role={user.role} user={user}>
      <h1>Manage Users</h1>
      <div
        className="manage-users-container"
        style={{ display: 'flex', gap: '2rem' }}
      >
        {/* ==================== CARD 1: ADD / UPDATE TEACHER STATUS ===================== */}
        <div
          className="card"
          style={{
            flex: 1,
            padding: '1rem',
            border: '1px solid #ccc'
          }}
        >
          <h2>Add / Update Teacher Status (HOD / HOI)</h2>
          {statusError && (
            <p className="error-message">{statusError}</p>
          )}
          {statusSuccess && (
            <p style={{ color: 'green' }}>{statusSuccess}</p>
          )}

          <form onSubmit={handleUpdateStatus}>
            <div style={{ marginBottom: '1rem' }}>
              <label>Teacher ID / Email</label><br />
              <input
                type="text"
                value={teacherIdForStatus}
                onChange={(e) => setTeacherIdForStatus(e.target.value)}
                className="filter-input"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label>Set Status</label><br />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="filter-select"
              >
                <option value="teacher">Teacher</option>
                <option value="HOD">HOD</option>
                <option value="HOI">HOI</option>
              </select>
            </div>

            <button
              type="submit"
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              Update Status
            </button>
          </form>
        </div>

        {/* ==================== CARD 2: CREATE DEPARTMENTAL ADMIN ===================== */}
        <div
          className="card"
          style={{
            flex: 1,
            padding: '1rem',
            border: '1px solid #ccc'
          }}
        >
          <h2>Create Departmental Admin</h2>
          {createError && (
            <p className="error-message">{createError}</p>
          )}
          {createSuccess && (
            <p style={{ color: 'green' }}>{createSuccess}</p>
          )}

          <form
            onSubmit={handleCreateAdmin}
            style={{ maxWidth: '500px' }}
            className="form-container register"
          >
            {/* ID */}
            <div style={{ marginBottom: '1rem' }}>
              <label>ID</label><br />
              <input
                className="filter-input"
                type="text"
                name="id"
                value={adminFormData.id}
                onChange={handleAdminChange}
              />
            </div>

            {/* NAME */}
            <div style={{ marginBottom: '1rem' }}>
              <label>Name</label><br />
              <input
                className="filter-input"
                type="text"
                name="name"
                value={adminFormData.name}
                onChange={handleAdminChange}
              />
            </div>

            {/* GITAM EMAIL */}
            <div style={{ marginBottom: '1rem' }}>
              <label>GITAM Email</label><br />
              <input
                className="filter-input"
                type="email"
                name="gitamEmail"
                value={adminFormData.gitamEmail}
                onChange={handleAdminChange}
              />
            </div>

            {/* PASSWORD */}
            <div style={{ marginBottom: '1rem' }}>
              <label>Password</label><br />
              <input
                className="filter-input"
                type="password"
                name="password"
                value={adminFormData.password}
                onChange={handleAdminChange}
              />
            </div>

            {/* CAMPUS */}
            <div style={{ marginBottom: '1rem' }}>
              <label>Campus</label><br />
              <select
                className="filter-select"
                name="campus"
                value={adminFormData.campus}
                onChange={handleCampusChange}
              >
                <option value="">--Select Campus--</option>
                {campusOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* SCHOOL */}
            <div style={{ marginBottom: '1rem' }}>
              <label>School</label><br />
              <select
                className="filter-select"
                name="school"
                value={adminFormData.school}
                onChange={handleSchoolChange}
                disabled={!adminFormData.campus}
              >
                <option value="">--Select School--</option>
                {adminFormData.campus &&
                  campusToSchools[adminFormData.campus]?.map((sch) => (
                    <option key={sch} value={sch}>{sch}</option>
                  ))}
              </select>
            </div>

            {/* DEPARTMENT */}
            <div style={{ marginBottom: '1rem' }}>
              <label>Department</label><br />
              <select
                className="filter-select"
                name="department"
                value={adminFormData.department}
                onChange={handleDepartmentChange}
                disabled={!adminFormData.school}
              >
                <option value="">--Select Department--</option>
                {adminFormData.school &&
                  allDepartments[adminFormData.school]?.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
              </select>
            </div>

            <button
              type="submit"
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              Create Department Admin
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsersPage;
