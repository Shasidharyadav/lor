// src/pages/LoRRequests.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { fetchLoRRequests } from '../services/api';
import "../styles/global.css";
import "../styles/AcceptLoR.css"; // Ensure you have this CSS file

const LoRRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const allRequests = await fetchLoRRequests(userRole);
        setRequests(allRequests);
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
    navigate(`/dashboard/student/lor-request/${requestId}`);
  };

  return (
    <DashboardLayout role="teacher">
      <h2>LoR Requests</h2>

      {loading ? (
        <p>Loading LoR requests...</p>
      ) : requests.length > 0 ? (
        <table className="custom-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Faculty ID</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
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
    </DashboardLayout>
  );
};

export default LoRRequests;
