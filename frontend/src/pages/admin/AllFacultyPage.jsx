// src/pages/Admin/AllFacultyPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { fetchAllFaculty, deleteUser } from '../../services/api';
import { 
  campusOptions, 
  campusToSchools, 
  allDepartments, 
  allSpecializations 
} from '../../utilities/filterData';

import '../../styles/global.css';
import successImg from '../../assets/success_img.png';

const AllFacultyPage = () => {
  document.title = "All Faculty";
  const user = JSON.parse(localStorage.getItem('user')) || {};

  // Filter states
  const [campus, setCampus] = useState("");
  const [school, setSchool] = useState("");
  const [department, setDepartment] = useState("");
  const [specialization, setSpecialization] = useState("");

  // Data
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
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

  // Handle campus selection
  const handleCampusChange = (e) => {
    setCampus(e.target.value);
    // reset subsequent fields
    setSchool("");
    setDepartment("");
    setSpecialization("");
  };

  // Handle school selection
  const handleSchoolChange = (e) => {
    setSchool(e.target.value);
    setDepartment("");
    setSpecialization("");
  };

  // Handle department selection
  const handleDepartmentChange = (e) => {
    setDepartment(e.target.value);
    setSpecialization("");
  };

  const handleSpecializationChange = (e) => {
    setSpecialization(e.target.value);
  };

  const fetchFacultyData = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = {};
      if (campus) filters.campus = campus;
      if (school) filters.school = school;
      if (department) filters.department = department;
      if (specialization) filters.specialization = specialization;

      const data = await fetchAllFaculty(filters);
      setFaculty(data.faculty || []);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFacultyData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campus, school, department, specialization]);

  const handleConfirmDelete = (Id) => {
    setSelectedFacultyId(Id);
    setConfirmDelete(true);
  };

  const handleDelete = async () => {
    if (!selectedFacultyId){
        console.log("Faculty ID is missing. Cannot delete faculty.", selectedFacultyId);
        return;
    }
    try {
      console.log("Deleting faculty with ID:", selectedFacultyId);
      await deleteUser(selectedFacultyId);
      setConfirmDelete(false);
      setShowPopup(true);
      fetchFacultyData(); // refresh list after delete
      setTimeout(() => setShowPopup(false), 2000);
    } catch (err) {
        console.error("Error deleting faculty:", err);
        setError(err);
    }
  };


  const tableHeaders = [
    "ID",
    "Name",
    "Email ID",
    // "Phone",
    "Campus",
    // "School",
    // "Department",
    // "Specialization",
    "Designation",
    "Action",
  ];

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>All Faculty</h2>

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Campus */}
        <div className="filter-group">
          <label className='labels'>Campus</label>
          <select
            className="credentials dropdown"
            value={campus}
            onChange={handleCampusChange}
          >
            <option value="">All</option>
            {campusOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* School */}
        <div className="filter-group">
          <label className='labels'>School</label>
          <select
            className="credentials dropdown"
            value={school}
            onChange={handleSchoolChange}
            disabled={!campus}
          >
            <option value="">All</option>
            {campus && campusToSchools[campus]?.map((sch) => (
              <option key={sch} value={sch}>{sch}</option>
            ))}
          </select>
        </div>

        {/* Department */}
        <div className="filter-group">
          <label className='labels'>Department</label>
          <select
            className="credentials dropdown"
            value={department}
            onChange={handleDepartmentChange}
            disabled={!school}
          >
            <option value="">All</option>
            {school && allDepartments[school]?.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        {/* Specialization */}
        <div className="filter-group">
          <label className='labels'>Specialization</label>
          <select
            className="credentials dropdown"
            value={specialization}
            onChange={handleSpecializationChange}
            disabled={!department}
          >
            <option value="">All</option>
            {department && allSpecializations[department]?.map((spec) => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}

      {faculty.length > 0 ? (
        <table className="custom-table">
          <thead>
            <tr>
              {tableHeaders.map((h) => <th key={h}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {faculty.map((f, idx) => (
              <tr key={`faculty-${idx}`}>
                <td>{f.id}</td>
                <td>{f.name}</td>
                <td>{f.gitamEmail}</td>
                {/* <td>{f.phone}</td> */}
                <td>{f.campus}</td>
                {/* <td>{f.school}</td> */}
                {/* <td>{f.department}</td> */}
                {/* <td>{f.specialization}</td> */}
                <td>{f.designation}</td>
                <td><button onClick= {() => handleConfirmDelete(f.id)} className='buttons delete'>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="no-requests-message">No faculty found.</p>
      )}

      {/* Confirm delete dialog */}
      {confirmDelete && (
        <div className="confirm-delete" ref={confirmDeleteRef}>
          <p>Are you sure you want to PERMENANTLY delete this faculty?</p>
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
          <span>Faculty deleted successfully!</span>
        </div>
      )}
    </DashboardLayout>
  );
};

export default AllFacultyPage;
