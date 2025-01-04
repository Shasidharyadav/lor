import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import Table from '../components/Dashboard/Table';
import { getAcceptedRequests } from '../services/api'; // Import the API function
import "../styles/global.css";

const AcceptedRequests = () => {
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Retrieve user info from localStorage
  const userData = JSON.parse(localStorage.getItem('user'));
  const userRole = userData?.role; // 'student' or 'teacher'
  const userId = userData?.id; // e.g., 'student123' or 'teacher456'

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      try {
        if (!userRole || !userId) {
          throw new Error('User not authenticated');
        }

        // Fetch data from the API
        const data = await getAcceptedRequests(userRole, userId);

        // Set the fetched data to state
        setAcceptedRequests(data);
      } catch (err) {
        console.error('Error fetching accepted requests:', err);
        setError(err.message || 'Failed to load accepted requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchAcceptedRequests();
  }, [userRole, userId]);

  // Define table headers based on role
  const tableHeaders = userRole === 'student'
    ? ['Request ID', 'Status', 'Faculty Name', 'Reason']
    : ['Request ID', 'Status', 'Student Name', 'Reason'];

  return (
    <DashboardLayout role={userRole}>
      <div className="accepted-requests-container">
        <h2>Accepted Requests</h2>

        {loading ? (
          <p>Loading accepted requests...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : acceptedRequests.length > 0 ? (
          <Table headers={tableHeaders} rows={acceptedRequests} role={userRole} />
        ) : (
          <p className="no-requests-message">No accepted requests found.</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AcceptedRequests;
