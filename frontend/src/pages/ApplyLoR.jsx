import React, { useState } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import dummyData from '../utilities/dummyData';
import "../styles/global.css";

const ApplyLoR = () => {
  const [form, setForm] = useState({ faculty: '', reason: '' });
  const [pendingRequests, setPendingRequests] = useState(dummyData.tables.studentPendingRequests);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequestId = `REQ${Math.floor(Math.random() * 1000) + 127}`;
    const newRequest = [newRequestId, 'Pending', form.faculty, form.reason];
    setPendingRequests([...pendingRequests, newRequest]);
    alert(`LoR Request ${newRequestId} submitted successfully!`);
    setForm({ faculty: '', reason: '' });
  };

  return (
    <DashboardLayout role="student">
      <h2>Apply for a Letter of Recommendation</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Faculty:
          <input
            type="text"
            value={form.faculty}
            onChange={(e) => setForm({ ...form, faculty: e.target.value })}
            required
          />
        </label>
        <label>
          Reason:
          <textarea
            value={form.reason}
            onChange={(e) => setForm({ ...form, reason: e.target.value })}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
      <h2>Pending Requests</h2>
      {pendingRequests.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Status</th>
              <th>Faculty</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((req) => (
              <tr key={req[0]}>
                <td>{req[0]}</td>
                <td>{req[1]}</td>
                <td>{req[2]}</td>
                <td>{req[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pending requests.</p>
      )}
    </DashboardLayout>
  );
};

export default ApplyLoR;
