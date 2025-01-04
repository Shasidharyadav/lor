// src/pages/ViewLoRRequest.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { getLorRequestDetails, updateLorRequestStatus } from '../services/api';
import "../styles/ViewLoRRequest.css"; // Import the CSS file

const ViewLoRRequest = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [lorData, setLorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // To handle button disable state

  useEffect(() => {
    const fetchLorDetails = async () => {
      try {
        const data = await getLorRequestDetails(requestId);
        setLorData(data);
      } catch (error) {
        console.error('Error fetching LoR request details:', error);
        alert('Failed to load LoR request details.');
      } finally {
        setLoading(false);
      }
    };

    fetchLorDetails();
  }, [requestId]);

  const handleApprove = async () => {
    const confirmApprove = window.confirm(`Are you sure you want to APPROVE request #${requestId}?`);
    if (!confirmApprove) return;

    setActionLoading(true);
    try {
      await updateLorRequestStatus(requestId, { status: 'APPROVED' });
      alert(`Request #${requestId} approved successfully.`);
      navigate('/dashboard/teacher'); // Navigate back to LoR requests list
    } catch (error) {
      console.error('Error approving LoR request:', error);
      alert('Failed to approve LoR request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveAndGenerate = async () => {
    const confirmApprove = window.confirm(`Are you sure you want to APPROVE request #${requestId} and generate LoR?`);
    if (!confirmApprove) return;

    setActionLoading(true);
    try {
      await updateLorRequestStatus(requestId, { status: 'APPROVED' });
      navigate(`/accepted-requests/generate-lor/${requestId}`, { state: { lorData }}); // Navigate to Generate LoR page
    } catch (error) {
      console.error('Error approving LoR request:', error);
      alert('Failed to approve LoR request.');
    } finally {
      setActionLoading(false);
    }
  };

  const GenerateLOR = async () => {
    navigate(`/accepted-requests/generate-lor/${requestId}`, { state: { lorData }}); // Navigate to Generate LoR page
  };

  const handleDecline = async () => {
    const confirmDecline = window.confirm(`Are you sure you want to DECLINE request #${requestId}?`);
    if (!confirmDecline) return;

    setActionLoading(true);
    try {
      await updateLorRequestStatus(requestId, { status: 'DECLINED' });
      alert(`Request #${requestId} declined successfully.`);
      navigate('/dashboard/teacher'); // Navigate back to LoR requests list
    } catch (error) {
      console.error('Error declining LoR request:', error);
      alert('Failed to decline LoR request.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="teacher">
        <h2>Loading LoR Request #{requestId}...</h2>
      </DashboardLayout>
    );
  }

  if (!lorData) {
    return (
      <DashboardLayout role="teacher">
        <h2>LoR Request #{requestId} not found.</h2>
      </DashboardLayout>
    );
  }

  const {
    request_id,
    teacher_id,
    student_id,
    campus,
    school,
    department,
    specialization,
    lor_content,
    status,
    created_at,
    universities,
    student_info,
  } = lorData;

  return (
    <DashboardLayout role="teacher">
      <h2>LoR Request Details</h2>

      <div className="lor-details">
        {/* Request Information Section */}
        <section>
          <h3>Request Information</h3>
          <p><strong>Request ID:</strong> {request_id}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Created At:</strong> {new Date(created_at).toLocaleString()}</p>
        </section>

        {/* Student Information Section */}
        <section>
          <h3>Student Information</h3>
          {student_info ? (
            <div className="student-profile">
              <p><strong>ID:</strong> {student_info.id}</p>
              <p><strong>Name:</strong> {student_info.name}</p>
              <p><strong>Gitam Email:</strong> {student_info.gitamEmail}</p>
              <p><strong>Personal Email:</strong> {student_info.personalEmail}</p>
              <p><strong>Campus:</strong> {student_info.campus}</p>
              <p><strong>School:</strong> {student_info.school}</p>
              <p><strong>Department:</strong> {student_info.department}</p>
              <p><strong>Specialization:</strong> {student_info.specialization}</p>
              <p><strong>Year of Passout:</strong> {student_info.yearOfPassout}</p>
            </div>
          ) : (
            <p>Student information not available.</p>
          )}
        </section>

        {/* LOR Content Section */}
        <section>
          <h3>LOR Content</h3>
          <p>{lor_content}</p>
        </section>

        {/* Selected Universities Section */}
        <section className="selected-universities">
          <h3>Selected Universities</h3>
          {universities && universities.length > 0 ? (
            <ul>
              {universities.map((uni, index) => (
                <li key={index}>
                  {uni.name} ({uni.country})
                </li>
              ))}
            </ul>
          ) : (
            <p>No universities selected.</p>
          )}
        </section>
      </div>

      {/* Action Buttons */}
      {status === 'PENDING' && (
        <div className="action-buttons">
          <button 
            onClick={handleApprove} 
            className="approve-btn" 
            disabled={actionLoading}
            style={{ opacity: actionLoading ? 0.6 : 1, cursor: actionLoading ? 'not-allowed' : 'pointer' }}
          >
            {actionLoading ? 'Approving...' : 'Approve'}
          </button>
          <button 
            onClick={handleDecline} 
            className="decline-btn" 
            disabled={actionLoading}
            style={{ opacity: actionLoading ? 0.6 : 1, cursor: actionLoading ? 'not-allowed' : 'pointer' }}
          >
            {actionLoading ? 'Declining...' : 'Decline'}
          </button>
          <button 
            onClick={handleApproveAndGenerate} 
            className="approve-btn" 
            disabled={actionLoading}
            style={{ opacity: actionLoading ? 0.6 : 1, cursor: actionLoading ? 'not-allowed' : 'pointer' }}
          >
            {actionLoading ? 'Approving & Generating...' : 'Approve & Generate LOR'}
          </button>
        </div>
      )}
      {status === 'APPROVED' && (
        <div className="action-buttons">
          <button 
            onClick={GenerateLOR} 
            className="approve-btn" 
            disabled={actionLoading}
            style={{ opacity: actionLoading ? 0.6 : 1, cursor: actionLoading ? 'not-allowed' : 'pointer' }}
          >
            {actionLoading ? 'Generating...' : 'Generate LoR'}
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ViewLoRRequest;
