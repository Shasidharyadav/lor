// src/pages/AcceptedRequests.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getAcceptedRequests } from '../services/api';
import "../styles/global.css";
import { FaFilter } from 'react-icons/fa';

const AcceptedRequests = () => {
  document.title = 'Finished Requests';

  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');


  const navigate = useNavigate();
  const location = useLocation();
  // Grab ?status=XYZ from the URL (optional)
  const queryParams = new URLSearchParams(location.search);
  const initialStatus = queryParams.get('status'); // e.g. 'ACCEPTED'

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
      ? ['Request ID', 'Faculty Name(ID)', 'Deadline', 'Status', 'Action']
      : ['Request ID', 'Student Name(ID)', 'Deadline', 'Status', 'Action'];

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
      <h2 className='header-container'>
        Finished Requests
      </h2>
        <div>
        <table className="custom-table">
            <thead>
              <tr>
                <th>Request ID</th>
                {userRole === 'teacher' ? (
                  <th>Student Name (ID)</th>
                  ) : (
                  <th>Faculty Name (ID)</th>
                )}
                <th>Deadline(DD/MM/YYYY)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
        {loading ? (
          <p>Loading accepted requests...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : acceptedRequests.length > 0 ? (
            <tbody>
              {acceptedRequests.map((request, idx) => {
                const nameToShow =
                  userRole === 'teacher' ? request.student_name : request.teacher_name;
                const idToShow =
                  userRole === 'teacher' ? request.student_id : request.teacher_id;
                return (
                  <tr key={`request-${idx}`}>
                  <td>{request.request_id || 'N/A'}</td>
                  <td>{request.status || 'N/A'}</td>
                  <td>
                      {nameToShow || 'Unknown'} ({idToShow || 'N/A'})
                  </td>
                  {/* <td>{request.lor_content || 'N/A'}</td> */}
                  <td>{request.deadline ? new Date(request.deadline).toLocaleDateString('en-GB', {day: '2-digit', month: '2-digit', year: 'numeric'}) : 'N/A'}</td>  {/* Updated Cell */}
                  <td>
                    <button
                      className="view-btn"
                      onClick={() => handleView(request.request_id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
        ) : (
          <tbody>
            <tr>
              <td colSpan={5}>
                <p className="no-requests-message">No finished requests found.</p>
              </td>
            </tr>
          </tbody>
        )}
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AcceptedRequests;
