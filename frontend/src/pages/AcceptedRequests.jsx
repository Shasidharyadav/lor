// src/pages/AcceptedRequests.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getAcceptedRequests } from '../services/api';
import "../styles/global.css";
import { FaFilter } from 'react-icons/fa';

const AcceptedRequests = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterPopup, setFilterPopup] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();
  // Grab ?status=XYZ from the URL (optional)
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status'); // e.g. 'APPROVED'

  // Retrieve user info from localStorage with error handling
  const userData = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (err) {
      console.error('Error parsing user data from localStorage:', err);
      return null;
    }
  })();

  const userRole = userData?.role; // 'student' or 'teacher'
  const userId = userData?.id;     // e.g., 'student123' or 'teacher456'

  useEffect(() => {
    const fetchAcceptedRequestsData = async () => {
      try {
        if (!userRole || !userId) {
          throw new Error('User not authenticated');
        }

        // Fetch data from the API
        const data = await getAcceptedRequests(userRole, userId);

        // Validate the data structure
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received from the server');
        }

        setAcceptedRequests(data);
        setFilteredRequests(data);

        // If there's a ?status=XYZ, auto-filter
        if (initialStatus) {
          setSelectedStatuses([initialStatus]);
          const autoFiltered = data.filter((req) => req.status === initialStatus);
          setFilteredRequests(autoFiltered);
        }
      } catch (err) {
        console.error('Error fetching accepted requests:', err);
        setError(err.message || 'Failed to load accepted requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedRequestsData();
  }, [userRole, userId, initialStatus]);

  // Define table headers based on role
  const tableHeaders =
    userRole === 'student'
      ? ['Request ID', 'Status', 'Faculty Name', 'Reason', 'Action']
      : ['Request ID', 'Status', 'Student Name', 'Reason', 'Action'];

  // Handle navigation to the LoR request detail page
  const handleView = (requestId) => {
    if (userRole === 'teacher') {
      // e.g., "/teacher/lor-request/:requestId"
      navigate(`/teacher/view-lor-request/${requestId}`);
    } else if (userRole === 'student') {
      // e.g., "/student/view-lor-request/:requestId"
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
      const newFiltered = acceptedRequests.filter((req) =>
        selectedStatuses.includes(req.status)
      );
      setFilteredRequests(newFiltered);
    } else {
      setFilteredRequests(acceptedRequests);
    }
    toggleFilterPopup();
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedStatuses([]);
    setFilteredRequests(acceptedRequests);
    toggleFilterPopup();
  };

  // If user is not authenticated, display a message
  if (!userRole || !userId) {
    return (
      <DashboardLayout role={userRole}>
        <div className="accepted-requests-container">
          <h2>Accepted Requests</h2>
          <p className="error-message">You must be logged in to view accepted requests.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={userRole}>
      <div className={`background ${filterPopup ? 'popup-active' : ''}`}>
        <h2 className='header-container'>Accepted Requests
          <button className="filter-btn" onClick={toggleFilterPopup}>
            <FaFilter style={{ marginRight: '5px' }} /> Filter
          </button>
        </h2>

        {loading ? (
          <p>Loading accepted requests...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : filteredRequests.length > 0 ? (
          <table className="custom-table">
            <thead>
              <tr>
                {tableHeaders.map((header, idx) => (
                  <th key={`header-${idx}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((request, idx) => (
                <tr key={`request-${idx}`}>
                  <td>{request.request_id || 'N/A'}</td>
                  <td>{request.status || 'N/A'}</td>
                  {userRole === 'student' ? (
                    <td>{request.teacher_name || 'N/A'}</td>
                  ) : (
                    <td>{request.student_name || 'N/A'}</td>
                  )}
                  <td>{request.lor_content || 'N/A'}</td>
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleView(request.request_id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-requests-message">No requests available.</p>
        )}

      {/* FILTER POPUP */}
      {filterPopup && (
          <div className="filter-popup">
            <div className="popup-content">
              <p className="filter-heading">Filter Requests</p>
              <div className="filter-buttons">
                {['APPROVED', 'FINISHED', 'EXPIRED'].map(
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

export default AcceptedRequests;
