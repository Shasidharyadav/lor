// src/pages/PendingRequests.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getPendingRequests } from '../services/api';
import "../styles/global.css";
import '../styles/PendingRequests.css';

const PendingRequests = () => {
  document.title = 'Pending Requests';

  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  let userData = null;
  try {
    userData = JSON.parse(localStorage.getItem('user'));
  } catch (err) {
    console.error('Error parsing user data from localStorage:', err);
  }

  const userRole = userData?.role; 
  const userId = userData?.id;

  useEffect(() => {
    console.log(`User Role: ${userRole}, User ID: ${userId}`);
  }, [userRole, userId]);

  useEffect(() => {
    const fetchPendingRequestsData = async () => {
      try {
        if (!userRole || !userId) {
          throw new Error('User not authenticated');
        }

        const data = await getPendingRequests(userRole, userId);
        console.log('Fetched pending requests:', data);

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }

        setPendingRequests(data);
      } catch (err) {
        console.error('Error fetching pending requests:', err);
        setError(err.message || 'Failed to load pending requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequestsData();
  }, [userRole, userId]);

  const tableHeaders =
    userRole === 'student'
      ? ['Request ID', 'Status', 'Faculty Name', 'Deadline', 'Action']
      : ['Request ID', 'Status', 'Student Name', 'Deadline', 'Action'];

  const handleView = (requestId) => {
    if (userRole === 'teacher') {
      navigate(`/teacher/view-lor-request/${requestId}`);
    } else if (userRole === 'student') {
      navigate(`/student/view-lor-request/${requestId}`);
    }
  };

  if (!userRole || !userId) {
    return (
      <DashboardLayout role={userRole}>
        <h2>Pending Requests</h2>
        <div className="pending-requests-container">
          <p className="error-message">You must be logged in to view pending requests.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={userRole}>
      <h2>Pending Requests</h2>
      <div>
        {loading ? (
          <p>Loading pending requests...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : pendingRequests.length > 0 ? (
          <table className="custom-table">
            <thead>
              <tr>
                {tableHeaders.map((header, idx) => (
                  <th key={`header-${idx}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((request, idx) => (
                <tr key={`request-${idx}`}>
                  <td>{request.request_id || 'N/A'}</td>
                  <td>{request.status || 'N/A'}</td>
                  {userRole === 'student' ? (
                    <td>{request.teacher_name || 'N/A'}</td>
                  ) : (
                    <td>{request.student_name || 'N/A'}</td>
                  )}
                  {/* <td>{request.lor_content || 'N/A'}</td> */}
                  <td>{request.deadline ? new Date(request.deadline).toLocaleDateString() : 'N/A'}</td>  {/* Updated Cell */}
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
          <p className="no-requests-message">No pending requests available.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PendingRequests;
