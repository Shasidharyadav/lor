import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getAcceptedRequests } from '../services/api';
import "../styles/global.css";

const AcceptedRequests = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
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
      } catch (err) {
        console.error('Error fetching accepted requests:', err);
        setError(err.message || 'Failed to load accepted requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedRequestsData();
  }, [userRole, userId]);

  // Define table headers based on role
  const tableHeaders = userRole === 'student'
    ? ['Request ID', 'Status', 'Faculty Name', 'Reason', 'Action']
    : ['Request ID', 'Status', 'Student Name', 'Reason', 'Action'];

  // Handle navigation to the LoR request detail page
  const handleView = (requestId) => {
    navigate(`/view-lor-request/${requestId}`);
  };

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
      <div className="accepted-requests-container">
        <h2>Accepted Requests</h2>

        {loading ? (
          <p>Loading accepted requests...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : acceptedRequests.length > 0 ? (
          <table className="custom-table">
            <thead>
              <tr>
                {tableHeaders.map((header, idx) => (
                  <th key={`header-${idx}`}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {acceptedRequests.map((request, idx) => (
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
          <p className="no-requests-message">No accepted requests available.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AcceptedRequests;
