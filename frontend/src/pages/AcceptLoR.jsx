// src/pages/AcceptLoR.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getTeacherRequests } from '../services/api';
import "../styles/global.css";
import "../styles/AcceptLoR.css"; // Ensure you have this CSS file

const AcceptLoR = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Retrieve teacher info from localStorage
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

  return (
    <DashboardLayout role="teacher">
      <h2>LoR Requests</h2>

      {loading ? (
        <p>Loading LoR requests...</p>
      ) : requests.length > 0 ? (
        <table className="lor-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Student ID</th>
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

export default AcceptLoR;
