import React from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import Table from '../components/Dashboard/Table';
import "../styles/global.css";

const PendingRequests = () => {
  // Fetch user role from localStorage

  // Common data to be shown for all roles (for now)
  const pendingRequestsData = [
    { requestId: 'REQ001', status: 'Pending', faculty: 'Dr. Aditi Sharma', reason: 'Letter of Recommendation' },
    { requestId: 'REQ002', status: 'Pending', faculty: 'Prof. Rajesh Kumar', reason: 'Internship Approval' },
    { requestId: 'REQ003', status: 'Pending', faculty: 'Dr. Nisha Verma', reason: 'LoR Request' },
    { requestId: 'REQ004', status: 'Pending', faculty: 'Dr. Arun Singh', reason: 'Project Approval' },
    { requestId: 'REQ005', status: 'Pending', faculty: 'Prof. Sneha Patil', reason: 'Scholarship Application' },
    { requestId: 'REQ006', status: 'Pending', faculty: 'Dr. Meera Iyer', reason: 'Conference Permission' },
    { requestId: 'REQ007', status: 'Pending', faculty: 'Prof. Vikram Reddy', reason: 'Internship Review' },
    { requestId: 'REQ008', status: 'Pending', faculty: 'Dr. Priya Gupta', reason: 'Project Support' },
    { requestId: 'REQ009', status: 'Pending', faculty: 'Prof. Karan Bhatia', reason: 'Research Assistance' },
    { requestId: 'REQ010', status: 'Pending', faculty: 'Dr. Snehal Deshmukh', reason: 'Lab Access Request' },
  ];

  // Define table headers
  const tableHeaders = ['Request ID', 'Status', 'Faculty', 'Reason'];

  return (
    <DashboardLayout>
      <h2>Pending Requests</h2>
      {pendingRequestsData.length > 0 ? (
        <Table headers={tableHeaders} rows={pendingRequestsData} />
      ) : (
        <p>No pending requests available.</p>
      )}
    </DashboardLayout>
  );
};

export default PendingRequests;
