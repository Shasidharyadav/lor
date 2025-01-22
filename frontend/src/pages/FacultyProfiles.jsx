import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import ProfileCard from '../components/Dashboard/ProfileCard';
import defaultProfileImage from "../assets/default-profile.png";
import "../styles/global.css";
import "../styles/FacultyProfiles.css";
import { fetchFacultyList, fetchDeclinedTeachers } from '../services/api';

const FacultyProfiles = () => {
  document.title = 'Faculty Profiles';

  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [nameSearch, setNameSearch] = useState("");

  // IDs of faculty who have already declined the student's LoR
  const [declinedTeacherIDs, setDeclinedTeacherIDs] = useState([]);

  const navigate = useNavigate();

  // Retrieve student info from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const studentId = userData.id; // e.g., "STU123"

  useEffect(() => {
    const loadFacultyAndDeclines = async () => {
      try {
        // 1) Fetch the entire faculty list
        const allFaculty = await fetchFacultyList();

        // 2) Also fetch which teachers declined this student
        const declinedTeachers = await fetchDeclinedTeachers(studentId);
        // expected format: e.g. [ 'FAC001', 'FAC123' ]

        setFacultyList(allFaculty);
        setDeclinedTeacherIDs(declinedTeachers || []);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    loadFacultyAndDeclines();
  }, [studentId]);

  // Clicking a faculty card opens a modal
  const handleProfileClick = (faculty) => {
    setSelectedFaculty(faculty);
    setShowModal(true);
  };

  // "Apply LoR" button in the modal
  const handleApplyLoR = () => {
    if (!selectedFaculty) return;
    // Pass selected faculty data to the next route
    navigate('/student/apply-lor', { state: { faculty: selectedFaculty } });
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedFaculty(null);
  };

  // 1) Filter by name
  let filteredFacultyList = facultyList.filter((faculty) =>
    faculty.name.toLowerCase().includes(nameSearch.toLowerCase())
  );

  // 2) Exclude faculty who have already declined LoR for this student
  filteredFacultyList = filteredFacultyList.filter(
    (faculty) => !declinedTeacherIDs.includes(faculty.id)
  );

  return (
    <DashboardLayout role="student">
      <div className={`faculty-profile-page ${showModal ? 'popup-active' : ''}`}>
        <h2 className="header-container">
          Faculty Profiles
          <input
            type="text"
            className="search-filter"
            placeholder="&#x1F50E;&#xFE0E; Search by Name"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
          />
        </h2>

        {/* Grid of faculty cards */}
        <div className="faculty-grid">
          {filteredFacultyList.map((faculty) => (
            <ProfileCard
              key={faculty.id}
              profile={faculty}
              onClick={() => handleProfileClick(faculty)}
            />
          ))}
        </div>

        {/* Modal popup for selected faculty */}
        {showModal && selectedFaculty && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={closeModal}>
                X
              </button>

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

                <button className="apply-lor-btn" onClick={handleApplyLoR}>
                  Apply LoR
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FacultyProfiles;
