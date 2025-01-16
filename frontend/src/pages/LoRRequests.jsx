// src/pages/LoRRequests.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getStudentRequests } from '../services/api';
import "../styles/global.css";
import "../styles/AcceptLoR.css"; // Ensure you have this CSS file
import { FaFilter } from 'react-icons/fa';

const LoRRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [filterPopup, setFilterPopup] = useState(false);
    const [selectedStatuses, setSelectedStatuses] = useState([]);
  const navigate = useNavigate();
  
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
    const userId = userData?.id; // e.g., 'student123' or 'teacher456'

  useEffect(() => {
    const loadRequests = async () => {
      try {
        if (!userRole || !userId) {
          console.error('No Student ID found in localStorage or user is not a student');
          setLoading(false);
          return;
        }
        const allRequests = await getStudentRequests(userId);
        setRequests(allRequests);
        setFilteredRequests(allRequests);
      } catch (error) {
        console.error('Error fetching student LoR requests:', error);
        alert('Failed to fetch LoR requests.');
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, [userId]);

  const handleViewRequest = (requestId) => {
    navigate(`/view-lor-request/${requestId}`);
  };

  const toggleFilterPopup = () => {
    setFilterPopup(!filterPopup);
  };

  const handleStatusToggle = (status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const applyFilters = () => {
    if (selectedStatuses.length > 0) {
      const filtered = requests.filter((req) => selectedStatuses.includes(req.status));
      setFilteredRequests(filtered);
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
      <div  className={`background ${filterPopup? 'popup-active': ''}`}>
      <h2 className='header-container'>LoR Requests
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
              <th>Student ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.request_id}>
                <td>{req.request_id}</td>
                <td>{req.student_id}</td>
                <td>{req.status}</td>
                <td>
                  <button onClick={() => handleViewRequest(req.request_id)} className="view-btn">
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
            <p className='filter-heading'>Filter Requests</p>
            <div className="filter-buttons">
              {['PENDING', 'APPROVED', 'DECLINED', 'FINISHED', 'EXPIRED'].map((status) => (
                <button
                  key={status}
                  className={`status-btn ${selectedStatuses.includes(status) ? 'active' : ''}`}
                  onClick={() => handleStatusToggle(status)}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="popup-actions">
              <button onClick={applyFilters} className="apply-btn">Apply</button>
              <button onClick={clearFilters} className="clear-btn">Clear All</button>
            </div>
          </div>
        </div>
      )}
      </div>
    </DashboardLayout>
  );
};

export default LoRRequests;
