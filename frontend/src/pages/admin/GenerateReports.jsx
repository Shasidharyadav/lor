// src/pages/Admin/GenerateReportsPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { fetchReports } from '../../services/api'; // or your adminApi if separate
import {
  campusOptions,
  campusToSchools,
  allDepartments,
  allSpecializations
} from '../../utilities/filterData';

import '../../styles/global.css'; // Ensure .custom-table, .filter-bar, etc. are defined here or in a separate CSS

const GenerateReportsPage = () => {
  document.title = "Generate Reports | Admin";
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Filters
  const [campus, setCampus] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");

  // Report data
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // -------------------------------
  // 1. Handle Filter Changes
  // -------------------------------
  const handleCampusChange = (e) => {
    setCampus(e.target.value);
    setSchool("");
    setDepartment("");
    setSpecialization("");
  };

  const handleSchoolChange = (e) => {
    setSchool(e.target.value);
    setDepartment("");
    setSpecialization("");
  };

  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setSpecialization("");
  };

  const handleSpecializationChange = (e) => {
    setSpecialization(e.target.value);
  };

  // -------------------------------
  // 2. Fetch All Reports on Mount
  // -------------------------------
  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await fetchReports(); // E.g. GET /api/admin/reports
        setReports(data || []);
        setFilteredReports(data || []);
      } catch (err) {
        setError(err.message);
      }
      setLoading(false);
    };
    loadReports();
  }, []);

  // -------------------------------
  // 3. Apply Filters Locally
  // -------------------------------
  useEffect(() => {
    let newFiltered = [...reports];
    if (campus) {
      newFiltered = newFiltered.filter(r => r.campus === campus);
    }
    if (school) {
      newFiltered = newFiltered.filter(r => r.school === school);
    }
    if (department) {
      newFiltered = newFiltered.filter(r => r.department === department);
    }
    if (specialization) {
      newFiltered = newFiltered.filter(r => r.specialization === specialization);
    }
    setFilteredReports(newFiltered);
  }, [campus, school, department, specialization, reports]);

  // -------------------------------
  // 4. Download Logic (Placeholder)
  // -------------------------------
  const handleDownload = (report) => {
    // Example placeholder: pass campus/school/department/specialization + report.id
    alert(`Download/Export logic for report ID: ${report.id}\n` +
      `Filters: ${campus}, ${school}, ${department}, ${specialization}`);
    // Here you would call e.g. fetch(`/api/admin/reports/export?reportId=${report.id}&campus=...`) etc.
  };

  // -------------------------------
  // 5. Render
  // -------------------------------
  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>Generate Reports</h2>

      {error && <p className="error-message">{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label>Campus</label>
          <select className="filter-select" value={campus} onChange={handleCampusChange}>
            <option value="">All</option>
            {campusOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>School</label>
          <select
            className="filter-select"
            value={school}
            onChange={handleSchoolChange}
            disabled={!campus}
          >
            <option value="">All</option>
            {campus && campusToSchools[campus]?.map(sch => (
              <option key={sch} value={sch}>{sch}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Department</label>
          <select
            className="filter-select"
            value={department}
            onChange={handleDepartmentChange}
            disabled={!school}
          >
            <option value="">All</option>
            {school && allDepartments[school]?.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Specialization</label>
          <select
            className="filter-select"
            value={specialization}
            onChange={handleSpecializationChange}
            disabled={!department}
          >
            <option value="">All</option>
            {department && allSpecializations[department]?.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table of Filtered Reports */}
      {(!loading && filteredReports.length > 0) ? (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Title</th>
              <th>Campus</th>
              <th>School</th>
              <th>Department</th>
              <th>Specialization</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map((rep, idx) => (
              <tr key={idx}>
                <td>{rep.id}</td>
                <td>{rep.title}</td>
                <td>{rep.campus || '-'}</td>
                <td>{rep.school || '-'}</td>
                <td>{rep.department || '-'}</td>
                <td>{rep.specialization || '-'}</td>
                <td>
                  <button className="view-btn" onClick={() => handleDownload(rep)}>
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="no-requests-message">No reports found.</p>
      )}
    </DashboardLayout>
  );
};

export default GenerateReportsPage;
