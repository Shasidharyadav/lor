// src/pages/FacultyProfiles.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import ProfileCard from '../components/Dashboard/ProfileCard';
import dummyData from '../utilities/dummyData';
import "../styles/global.css";
import defaultProfileImage from "../assets/default-profile.png";
const FacultyProfiles = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const facultyList = dummyData.faculty;

  const handleProfileClick = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  const handleApplyLoR = () => {
    navigate('/dashboard/student/apply-lor', { state: { faculty: selectedFaculty } });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFaculty(null);
  };

  return (
    <DashboardLayout role="student">
      <h2>Faculty Profiles</h2>
      <div className="faculty-grid">
        {facultyList.map((faculty, index) => (
          <ProfileCard
            key={index}
            profile={faculty}
            onClick={() => handleProfileClick(faculty)}
          />
        ))}
      </div>

      {showModal && selectedFaculty && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>X</button>
            <h2>{selectedFaculty.name}</h2>
            <img
              src={defaultProfileImage}
              alt={selectedFaculty.name}
              className="profile-detail-image"
            />
            <p><strong>Department:</strong> {selectedFaculty.department}</p>
            <p><strong>Email:</strong> {selectedFaculty.email}</p>
            <p><strong>Qualifications:</strong> {selectedFaculty.qualifications}</p>
            <p><strong>Office Hours:</strong> {selectedFaculty.officeHours}</p>
            <p><strong>Research Interests:</strong> {selectedFaculty.researchInterests}</p>
            <p><strong>Bio:</strong> {selectedFaculty.bio}</p>
            <button className="apply-lor-btn" onClick={handleApplyLoR}>Apply LoR</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FacultyProfiles;
