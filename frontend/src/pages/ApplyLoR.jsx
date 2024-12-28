import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import dummyData from '../utilities/dummyData';
import "../styles/global.css";

const ApplyLoR = () => {
  const location = useLocation();
  const passedFaculty = location.state?.faculty;

  const [pendingRequests, setPendingRequests] = useState(dummyData.tables.studentPendingRequests);
  const [form, setForm] = useState({ department: '', faculty: '', reason: '' });

  // Extract faculty data
  const allFaculty = dummyData.faculty;

  // Get unique departments
  const departments = Array.from(new Set(allFaculty.map(f => f.department)));

  // Filtered faculty based on selected department
  const filteredFaculty = form.department 
    ? allFaculty.filter(f => f.department === form.department)
    : [];

  useEffect(() => {
    if (passedFaculty) {
      // Pre-fill form with passed faculty details
      setForm({
        department: passedFaculty.department,
        faculty: passedFaculty.name,
        reason: ''
      });
    }
  }, [passedFaculty]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequestId = `REQ${Math.floor(Math.random() * 1000) + 127}`;
    const newRequest = [newRequestId, 'Pending', form.faculty, form.reason];
    setPendingRequests([...pendingRequests, newRequest]);
    alert(`LoR Request ${newRequestId} submitted successfully!`);
    setForm({ department: '', faculty: '', reason: '' });
  };

  return (
    <DashboardLayout role="student">
      <h2>Apply for a Letter of Recommendation</h2>

      {passedFaculty && (
        <div style={{ marginBottom: '20px' }}>
          <h3>You are applying for a LoR from:</h3>
          <p><strong>Name:</strong> {passedFaculty.name}</p>
          <p><strong>Department:</strong> {passedFaculty.department}</p>
          <p><strong>Email:</strong> {passedFaculty.email}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="form">
        <label>
          Department:
          <select
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value, faculty: '' })}
            required
          >
            <option value="">-- Select a Department --</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>
        </label>

        <label>
          Faculty:
          <select
            value={form.faculty}
            onChange={(e) => setForm({ ...form, faculty: e.target.value })}
            required
            disabled={!form.department}
          >
            <option value="">-- Select a Faculty --</option>
            {filteredFaculty.map((fac, idx) => (
              <option key={idx} value={fac.name}>{fac.name}</option>
            ))}
          </select>
        </label>

        <label>
          LOR Content:
          <textarea
            value={form.lorcontent}
            onChange={(e) => setForm({ ...form, lorcontent: e.target.value })}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      
    </DashboardLayout>
  );
};

export default ApplyLoR;
