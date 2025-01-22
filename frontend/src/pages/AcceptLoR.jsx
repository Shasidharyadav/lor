// src/pages/AcceptLoR.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getTeacherRequests } from '../services/api';
import "../styles/global.css";
import "../styles/AcceptLoR.css";
import { FaFilter } from 'react-icons/fa';

const AcceptLoR = () => {
  document.title = 'Accept LOR';

  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPopup, setFilterPopup] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve teacher info from localStorage
  const userData = JSON.parse(localStorage.getItem('user')) || {};
  const teacherId = userData.id;

  // Grab ?status=XYZ from the URL
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status');

  useEffect(() => {
    const loadRequests = async () => {
      try {
        if (!teacherId) {
          console.error('No teacher ID found');
          setLoading(false);
          return;
        }

        // Fetch all requests for this teacher
        const allRequests = await getTeacherRequests(teacherId);
        // allRequests should include: { request_id, student_id, student_name, status, deadline, ... }
        
        setRequests(allRequests);
        setFilteredRequests(allRequests);

        // If there's a query param ?status=XYZ, automatically filter
        if (initialStatus) {
          setSelectedStatuses([initialStatus]);
          const autoFiltered = allRequests.filter((req) => req.status === initialStatus);
          setFilteredRequests(autoFiltered);
        }
      } catch (error) {
        console.error('Error fetching teacher LoR requests:', error);
        alert('Failed to fetch LoR requests.');
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [teacherId, initialStatus]);

  // Navigate to view-lor-request page
  const handleViewRequest = (requestId) => {
    navigate(`/teacher/view-lor-request/${requestId}`);
  };

  const toggleFilterPopup = () => setFilterPopup(!filterPopup);

  const handleStatusToggle = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

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

  const clearFilters = () => {
    setSelectedStatuses([]);
    setFilteredRequests(requests);
    toggleFilterPopup();
  };

  return (
    <DashboardLayout role="teacher">
      <div className={`background ${filterPopup ? 'popup-active' : ''}`}>
        <h2 className="header-container">
          LoR Requests
          <button className="filter-btn" onClick={toggleFilterPopup}>
            <FaFilter style={{ marginRight: '5px' }} /> Filter
          </button>
        </h2>

        {loading ? (
          <p>Loading LoR requests...</p>
        ) : filteredRequests.length > 0 ? (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Student Name (ID)</th>
                <th>Status</th>
                <th>Deadline</th> {/* New Column Header */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.request_id}>
                  <td>{req.request_id}</td>
                  <td>
                    {req.student_name || 'Unknown'} ({req.student_id})
                  </td>
                  <td>{req.status}</td>
                  <td>{req.deadline ? new Date(req.deadline).toLocaleDateString() : 'N/A'}</td>  {/* Updated Cell */}
                  <td>
                    <button
                      onClick={() => handleViewRequest(req.request_id)}
                      className="view-btn"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No LoR requests found.</p>
        )}

        {filterPopup && (
          <div className="filter-popup">
            <div className="popup-content">
              <p className="filter-heading">Filter Requests</p>
              <div className="filter-buttons">
                {['PENDING', 'APPROVED', 'DECLINED', 'FINISHED', 'EXPIRED'].map(
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

export default AcceptLoR;
