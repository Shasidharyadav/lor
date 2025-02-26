// src/pages/Admin/AllStudentsPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { fetchAllStudents, deleteUser } from '../../services/api';
import { 
  campusOptions, 
  campusToSchools, 
  allDepartments, 
  allSpecializations 
} from '../../utilities/filterData';

import '../../styles/global.css';
import successImg from '../../assets/success_img.png';


const AllStudentsPage = () => {
  document.title = "All Students";
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

  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const confirmDeleteRef = useRef(null);
  
  useEffect(() => {
    function handleClickOutside(event) {
      if (confirmDeleteRef.current && !confirmDeleteRef.current.contains(event.target)) {
        setConfirmDelete(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleConfirmDelete = (Id) => {
      setSelectedStudentId(Id);
      setConfirmDelete(true);
  };
  
    const handleDelete = async () => {
      if (!selectedStudentId){
          console.log("Student ID is missing. Cannot delete faculty.", selectedStudentId);
          return;
      }
      try {
        console.log("Deleting student with ID:", selectedStudentId);
        await deleteUser(selectedStudentId);
        setConfirmDelete(false);
        setShowPopup(true);
        fetchStudentsData(); // refresh list after delete
        setTimeout(() => setShowPopup(false), 2000);
      } catch (err) {
          console.error("Error deleting student:", err);
          setError(err);
      }
    };

  const tableHeaders = [
    "ID",
    "Name",
    "Email ID",
    "Campus",
    // "School",
    // "Department",
    // "Specialization",
    "Year of Passout",
    "Action",
  ];

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>All Students</h2>

      {/* Filter Bar */}
      <div className="filter-bar">
        <div className="filter-group">
          <label className='lables'>Campus</label>
          <select className="credentials dropdown" value={campus} onChange={handleCampusChange}>
            <option value="">All</option>
            {campusOptions.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label className='lables'>School</label>
          <select
            className="credentials dropdown"
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
          <label className='lables'>Department</label>
          <select
            className="credentials dropdown"
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
          <label className='lables'>Specialization</label>
          <select
            className="credentials dropdown"
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
                {/* <td>{stu.school}</td> */}
                {/* <td>{stu.department}</td> */}
                {/* <td>{stu.specialization}</td> */}
                <td>{stu.yearOfPassout}</td>
                <td><button onClick= {() => handleConfirmDelete(stu.id)} className='buttons delete'>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="no-requests-message">No students found.</p>
      )}

      {/* Confirm delete dialog */}
      {confirmDelete && (
      <div className="confirm-delete" ref={confirmDeleteRef}>
        <p>Are you sure you want to PERMENANTLY delete this student?</p>
        <div className='confirm-delete-buttons'>
          <button onClick={() => setConfirmDelete(false)} className='buttons cancel'>Cancel</button>
          <button className='buttons delete' onClick={handleDelete}>Delete</button>
        </div>
      </div>
      )}
            
      {/* Popup Notification */}
      {showPopup && (
        <div className="popup-success">
          <img src={successImg} alt="Success" />
          <span>Student deleted successfully!</span>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllStudentsPage;
