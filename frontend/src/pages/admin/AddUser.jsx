// src/pages/Admin/AddUserPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { createUserByAdmin } from '../../services/api';
import {
  campusOptions,
  campusToSchools,
  allDepartments,
  allSpecializations
} from '../../utilities/filterData';

import '../../styles/global.css';

const AddUserPage = () => {
  document.title = "Add User | Admin";
  const user = JSON.parse(localStorage.getItem('user')) || {};

  const [formData, setFormData] = useState({
    role: 'student',
    id: '',
    name: '',
    gitamEmail: '',
    campus: '',
    school: '',
    department: '',
    specialization: '',
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCampusChange = (e) => {
    setFormData(prev => ({
      ...prev,
      campus: e.target.value,
      school: '',
      department: '',
      specialization: ''
    }));
  };

  const handleSchoolChange = (e) => {
    setFormData(prev => ({
      ...prev,
      school: e.target.value,
      department: '',
      specialization: ''
    }));
  };

  const handleDepartmentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      department: e.target.value,
      specialization: ''
    }));
  };

  const handleSpecializationChange = (e) => {
    setFormData(prev => ({
      ...prev,
      specialization: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      await createUserByAdmin(formData);
      setSuccess("User created successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>Add User (Admin)</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit} style={{ maxWidth: '500px' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Role</label><br />
          <select name="role" value={formData.role} onChange={handleChange} className="filter-select">
            <option value="student">Student</option>
            <option value="teacher">Faculty</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>ID</label><br />
          <input
            className="filter-input"
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Name</label><br />
          <input
            className="filter-input"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>GITAM Email</label><br />
          <input
            className="filter-input"
            type="email"
            name="gitamEmail"
            value={formData.gitamEmail}
            onChange={handleChange}
          />
        </div>

        {/* Campus / School / Department / Specialization */}
        <div className="filter-group" style={{ marginBottom: '1rem' }}>
          <label>Campus</label>
          <select
            className="filter-select"
            name="campus"
            value={formData.campus}
            onChange={handleCampusChange}
          >
            <option value="">--Select Campus--</option>
            {campusOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group" style={{ marginBottom: '1rem' }}>
          <label>School</label>
          <select
            className="filter-select"
            name="school"
            value={formData.school}
            onChange={handleSchoolChange}
            disabled={!formData.campus}
          >
            <option value="">--Select School--</option>
            {formData.campus && campusToSchools[formData.campus]?.map(sch => (
              <option key={sch} value={sch}>{sch}</option>
            ))}
          </select>
        </div>

        <div className="filter-group" style={{ marginBottom: '1rem' }}>
          <label>Department</label>
          <select
            className="filter-select"
            name="department"
            value={formData.department}
            onChange={handleDepartmentChange}
            disabled={!formData.school}
          >
            <option value="">--Select Department--</option>
            {formData.school && allDepartments[formData.school]?.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="filter-group" style={{ marginBottom: '1rem' }}>
          <label>Specialization</label>
          <select
            className="filter-select"
            name="specialization"
            value={formData.specialization}
            onChange={handleSpecializationChange}
            disabled={!formData.department}
          >
            <option value="">--Select Specialization--</option>
            {formData.department && allSpecializations[formData.department]?.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>

        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Create User
        </button>
      </form>
    </DashboardLayout>
  );
};

export default AddUserPage;
