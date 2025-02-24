import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import {
  getStudentRequests,
  getTeacherRequests
} from '../services/api';
import "../styles/global.css";
import "../styles/AcceptLoR.css";
import { FaFilter, FaWindowClose, FaChevronDown } from 'react-icons/fa';

const LoRRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterPopup, setFilterPopup] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const [selectedSortOption, setSelectedSortOption] = useState('Nearest Deadline');
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const dropdownRef = useRef(null);
  const filterPopupRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  // Get user info from localStorage
  const userData = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (err) {
      console.error('Error parsing user data from localStorage:', err);
      return null;
    }
  })();

  const userRole = userData?.role; // 'student' or 'teacher'
  const userId = userData?.id;

  // Grab ?status=XYZ from the URL (optional)
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status'); // e.g. 'ACCEPTED'

  // Load requests on mount
  useEffect(() => {
    const loadRequests = async () => {
      try {
        if (!userId || !userRole) {
          console.error('No user ID or role found');
          setLoading(false);
          return;
        }

        // Decide whether to fetch teacher or student requests
        let allRequests = [];
        if (userRole === 'teacher') {
          allRequests = await getTeacherRequests(userId);
        } else if (userRole === 'student') {
          allRequests = await getStudentRequests(userId);
        } else {
          console.error('Role not supported by this page.');
          setLoading(false);
          return;
        }
        allRequests.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        setRequests(allRequests);
        setFilteredRequests(allRequests);

        // If there's a ?status=XYZ, auto-filter
        if (initialStatus) {
          setSelectedStatuses([initialStatus]);
          const autoFiltered = allRequests.filter((req) => req.status === initialStatus);
          setFilteredRequests(autoFiltered);
        }
      } catch (error) {
        console.error('Error fetching LoR requests:', error);
        alert('Failed to fetch LoR requests.');
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [userId, userRole, initialStatus]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
      if (filterPopupRef.current && !filterPopupRef.current.contains(event.target)) {
        setFilterPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // View a single request
  const handleViewRequest = (requestId) => {
    // If teacher -> /teacher/lor-request/:requestId
    // If student -> /student/view-lor-request/:requestId
    if (userRole === 'teacher') {
      navigate(`/teacher/view-lor-request/${requestId}`);
    } else if (userRole === 'student') {
      navigate(`/student/view-lor-request/${requestId}`);
    }
  };

  // Toggle the filter popup
  const toggleFilterPopup = () => {
    setFilterPopup(!filterPopup);
  };

  // Toggle a single status in selectedStatuses
  const handleStatusToggle = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Apply the chosen filters
  const applyFilters = () => {
    if (selectedStatuses.length > 0) {
      const newFiltered = requests.filter((req) =>
        selectedStatuses.includes(req.status)
      );
      setFilteredRequests(newFiltered);
    } else {
      setFilteredRequests(requests);
    }
    toggleFilterPopup();
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedStatuses([]);
    setFilteredRequests(requests);
    toggleFilterPopup();
  };

  const handleSortChange = (option) => {
    console.log(dropdownVisible);
    setSelectedSortOption(option);
  
    let sortedData = [...filteredRequests];
  
    if (option === "Latest") {
      sortedData.sort((a, b) => new Date(b.deadline) - new Date(a.deadline));
    } else if (option === "Oldest") {
      sortedData.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else {
      // Default: Nearest Deadline (same as Oldest)
      sortedData.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    }
  
    setFilteredRequests(sortedData);
    setDropdownVisible(false);
  };

  function selectOption(element) {
    document.getElementById("selected-option").innerText = element.innerText;
  }


  if (loading) {
    return (
      <DashboardLayout role={userRole}>
        <p>Loading LoR requests...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={userRole}>
      <div className={`background ${filterPopup ? 'popup-active' : ''}`}>
        <h2 className="header-container">
          {userRole === 'teacher' ? 'All LoR Requests' : 'All LoR Requests'}
          <div className='sort-filter-btns'>
            <div className="sort-container" ref={dropdownRef}>
              <p className="sort-label" style={{color: "var(--primary-hover-color)"}}>Sort By:</p>
              <div className='sort-current' onClick={() => setDropdownVisible((prev) => !prev)}>
                {selectedSortOption} <FaChevronDown style={{top: '15px', left: '130px'}}/>
              </div>
            {dropdownVisible && (
              <div className="sort-dropdown">
                <p onClick={() => handleSortChange("Nearest Deadline")}>Nearest Deadline</p>
                <p onClick={() => handleSortChange("Latest")}>Latest</p>
                <p onClick={() => handleSortChange("Oldest")}>Oldest</p>
              </div>
            )}
          </div>
          <button className="filter-btn" onClick={toggleFilterPopup}>
            <FaFilter style={{ marginRight: '3px', marginBottom: '0px' }} /> Filter
          </button>
          </div>
          </h2>

          {filteredRequests.length > 0 ? (
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  {/* If teacher -> Show "Student Name (ID)"; if student -> Show "Faculty Name (ID)" */}
                {userRole === 'teacher' ? (
                  <th>Student Name (ID)</th>
                ) : (
                  <th>Faculty Name (ID)</th>
                )}
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => {
                // figure out which name/id to show
                const nameToShow =
                  userRole === 'teacher' ? req.student_name : req.teacher_name;
                const idToShow =
                  userRole === 'teacher' ? req.student_id : req.teacher_id;

                return (
                  <tr key={req.request_id}>
                    <td>{req.request_id}</td>
                    <td>
                      {nameToShow || 'Unknown'} ({idToShow || 'N/A'})
                    </td>
                    <td>{req.deadline ? new Date(req.deadline).toLocaleDateString() : 'N/A'}</td>  {/* Updated Cell */}
                    <td>{req.status}</td>
                    <td>
                      <button
                        onClick={() => handleViewRequest(req.request_id)}
                        className="view-btn"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="no-requests-message">No LoR requests found.</p>
        )}

        {/* FILTER POPUP */}
        {filterPopup && (
          <div className="filter-popup" ref={filterPopupRef}>
            <div className='popup-close' onClick={toggleFilterPopup}><FaWindowClose style={{fontSize: '24px'}}/></div>
            <div className="popup-content">
              <p className="filter-heading">Filter Requests</p>
              <div className="filter-buttons">
                {['PENDING', 'ACCEPTED', 'DECLINED', 'FINISHED', 'EXPIRED', 'REQUESTED TO DELETE'].map(
                  (status) => (
                    <button
                      key={status}
                      className={`status-btn ${
                        selectedStatuses.includes(status) ? 'active' : ''
                      }`}
                      onClick={() => handleStatusToggle(status)}
                    >
                      {status}
                    </button>
                  )
                )}
              </div>
              <div className="popup-actions">
                <button onClick={applyFilters} className="apply-btn">
                  Apply
                </button>
                <button onClick={clearFilters} className="clear-btn">
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default LoRRequests;
