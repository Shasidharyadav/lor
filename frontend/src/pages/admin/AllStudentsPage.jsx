// src/pages/Admin/AllStudentsPage.jsx
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { fetchAllStudents } from '../../services/api';
import { 
  campusOptions, 
  campusToSchools, 
  allDepartments, 
  allSpecializations 
} from '../../utilities/filterData';

import '../../styles/global.css';


const AllStudentsPage = () => {
  document.title = "All Students | Admin";
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Filters
  const [campus, setCampus] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");

  // Data
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handlers for filter changes
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

  const fetchStudentsData = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (campus) filters.campus = campus;
      if (school) filters.school = school;
      if (department) filters.department = department;
      if (specialization) filters.specialization = specialization;

      const data = await fetchAllStudents(filters);
      setStudents(data.students || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStudentsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campus, school, department, specialization]);

  const tableHeaders = [
    "ID",
    "Name",
    "Gitam Email",
    "Campus",
    "School",
    "Department",
    "Specialization",
    "Year of Passout"
  ];

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>All Students</h2>

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

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {students.length > 0 ? (
        <table className="custom-table">
          <thead>
            <tr>
              {tableHeaders.map((h) => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {students.map((stu, idx) => (
              <tr key={`student-${idx}`}>
                <td>{stu.id}</td>
                <td>{stu.name}</td>
                <td>{stu.gitamEmail}</td>
                <td>{stu.campus}</td>
                <td>{stu.school}</td>
                <td>{stu.department}</td>
                <td>{stu.specialization}</td>
                <td>{stu.yearOfPassout}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="no-requests-message">No students found.</p>
      )}
    </DashboardLayout>
  );
};

export default AllStudentsPage;
