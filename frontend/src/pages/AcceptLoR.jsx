import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getTeacherRequests } from '../services/api';
import "../styles/global.css";
import "../styles/AcceptLoR.css";
import { FaFilter } from 'react-icons/fa';

const AcceptLoR = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterPopup, setFilterPopup] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem('user'));
  const teacherId = userData?.id;

  useEffect(() => {
    const loadRequests = async () => {
      try {
        if (!teacherId) {
          console.error('No teacher ID found in localStorage or user is not a teacher');
          setLoading(false);
          return;
        }
        const allRequests = await getTeacherRequests(teacherId);
        setRequests(allRequests);
        setFilteredRequests(allRequests);
      } catch (error) {
        console.error('Error fetching teacher LoR requests:', error);
        alert('Failed to fetch LoR requests.');
      } finally {
        setLoading(false);
      }
    };
    loadRequests();
  }, [teacherId]);

  const handleViewRequest = (requestId) => {
    navigate(`/dashboard/teacher/lor-request/${requestId}`);
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
  };

  return (
    <DashboardLayout role="teacher">
      <div  className={`background ${filterPopup? 'popup-active': ''}`}>
      <div className="header-container">
        <h2>LoR Requests</h2>
        <button className="filter-btn" onClick={toggleFilterPopup}>
          <FaFilter style={{ marginRight: '5px' }} /> Filter
        </button>
      </div>

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

export default AcceptLoR;
