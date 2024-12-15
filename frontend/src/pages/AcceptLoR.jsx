import React, { useState } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import dummyData from '../utilities/dummyData';
import "../styles/global.css";

const AcceptLoR = () => {
  const [pendingRequests, setPendingRequests] = useState(dummyData.tables.teacherPendingRequests);

  const handleAction = (requestId, action) => {
    setPendingRequests(pendingRequests.filter((req) => req[0] !== requestId));
    alert(`Request ${requestId} has been ${action}.`);
  };

  return (
    <DashboardLayout role="teacher">
      <h2>Approve or Decline LoR Requests</h2>
      {pendingRequests.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Student Name</th>
              <th>Reason</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((req) => (
              <tr key={req[0]}>
                <td>{req[0]}</td>
                <td>{req[1]}</td>
                <td>{req[2]}</td>
                <td>
                  <button
                    onClick={() => handleAction(req[0], 'approved')}
                    className="approve-btn"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req[0], 'declined')}
                    className="decline-btn"
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending LoR requests.</p>
      )}
    </DashboardLayout>
  );
};

export default AcceptLoR;
