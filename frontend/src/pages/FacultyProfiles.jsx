// src/pages/FacultyProfiles.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import ProfileCard from '../components/Dashboard/ProfileCard';
import defaultProfileImage from "../assets/default-profile.png";
import "../styles/global.css";
import { fetchFacultyList } from '../services/api'; // <-- Your API function

const FacultyProfiles = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // Fetch faculty data from the backend on mount
  useEffect(() => {
    const loadFaculty = async () => {
      try {
        const data = await fetchFacultyList(); // GET /api/users/faculty
        setFacultyList(data);
      } catch (error) {
        console.error('Failed to fetch faculty list:', error.message);
      }
    };
    loadFaculty();
  }, []);

  const handleProfileClick = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  const handleApplyLoR = () => {
    if (!selectedFaculty) return;
    // Navigate and pass the selected faculty data
    navigate('/dashboard/student/apply-lor', { state: { faculty: selectedFaculty } });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFaculty(null);
  };

  return (
    <DashboardLayout role="student">
      <h2>Faculty Profiles</h2>

      {/* Grid of faculty cards */}
      <div className="faculty-grid">
        {facultyList.map((faculty, index) => (
          <ProfileCard
            key={index}
            profile={faculty}
            onClick={() => handleProfileClick(faculty)}
          />
        ))}
      </div>

      {/* Modal popup for selected faculty */}
      {showModal && selectedFaculty && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>X</button>

            {/* Left column: Profile image */}
            <div className="left-column">
              <img
                src={defaultProfileImage}
                alt={selectedFaculty.name}
                className="profile-detail-image"
              />
            </div>

            {/* Right column: Faculty details */}
            <div className="right-column">
              <h2>{selectedFaculty.name}</h2>
              <p><strong>Email:</strong> {selectedFaculty.email}</p>
              <p><strong>Campus:</strong> {selectedFaculty.campus}</p>
              <p><strong>School:</strong> {selectedFaculty.school}</p>
              <p><strong>Department:</strong> {selectedFaculty.department}</p>
              <p><strong>Specialization:</strong> {selectedFaculty.specialization}</p>
              <p><strong>Designation:</strong> {selectedFaculty.designation}</p>
              <p><strong>Phone Number:</strong> {selectedFaculty.phone}</p>

              <p><strong>Qualifications:</strong> {selectedFaculty.qualifications}</p>
              <p><strong>Research Interests:</strong> {selectedFaculty.researchInterests}</p>
              <p><strong>Bio:</strong> {selectedFaculty.bio}</p>

              <button className="apply-lor-btn" onClick={handleApplyLoR}>
                Apply LoR
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FacultyProfiles;
