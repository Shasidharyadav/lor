// src/pages/ViewLoRRequest.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import {
  getLorRequestDetails,
  updateLorRequestStatus,
} from '../services/api';
import { jsPDF } from 'jspdf'; // for generating PDF
import "../styles/ViewLoRRequest.css";
import { FaDownload } from 'react-icons/fa';

const ViewLoRRequest = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [lorData, setLorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Retrieve user info from localStorage
  const userData = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch (err) {
      console.error('Error parsing user data from localStorage:', err);
      return null;
    }
  })();

  const userRole = userData?.role; // 'student' or 'teacher' or 'admin'
  const userId = userData?.id;

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

  // Teacher Approve
  const handleApprove = async () => {
    if (!window.confirm(`Are you sure you want to APPROVE request #${requestId}?`)) return;
    setActionLoading(true);
    try {
      await updateLorRequestStatus(requestId, { status: 'APPROVED' });
      alert(`Request #${requestId} approved successfully.`);

      // Example: navigate back to teacher's pending requests or teacher's dashboard
      // Choose whichever is correct for your app
      navigate('/teacher/pending-requests'); 
    } catch (error) {
      console.error('Error approving LoR request:', error);
      alert('Failed to approve LoR request.');
    } finally {
      setActionLoading(false);
    }
  };

  // Approve & Generate
  const handleApproveAndGenerate = async () => {
    if (!window.confirm(`Are you sure you want to APPROVE request #${requestId} and generate LoR?`)) return;
    setActionLoading(true);
    try {
      // Mark as approved
      await updateLorRequestStatus(requestId, { status: 'APPROVED' });

      // Navigate to generate page
      navigate(`/teacher/generate-lor/${requestId}`, {
        state: { lorData },
      });
    } catch (error) {
      console.error('Error approving LoR request:', error);
      alert('Failed to approve LoR request.');
    } finally {
      setActionLoading(false);
    }
  };

  // Decline
  const handleDecline = async () => {
    if (!window.confirm(`Are you sure you want to DECLINE request #${requestId}?`)) return;
    setActionLoading(true);
    try {
      await updateLorRequestStatus(requestId, { status: 'DECLINED' });
      alert(`Request #${requestId} declined successfully.`);

      // Example: teacher might go back to pending requests or dashboard
      navigate('/teacher/pending-requests');
    } catch (error) {
      console.error('Error declining LoR request:', error);
      alert('Failed to decline LoR request.');
    } finally {
      setActionLoading(false);
    }
  };

  // If teacher wants to generate LOR from an approved request
  const handleGenerateLor = () => {
    navigate(`/teacher/generate-lor/${requestId}`, {
      state: { lorData },
    });
  };

  // Student can download if status=FINISHED
  const handleFinished = () => {
    if (!lorData) return;

    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    let currentY = 20;

    doc.setFontSize(16);
    doc.text('Letter of Recommendation', pageWidth / 2, currentY, { align: 'center' });
    currentY += 10;

    // Teacher Info
    doc.setFontSize(12);
    doc.setFont('times', 'bold');
    if (lorData.name_address) {
      doc.text(`From: ${lorData.name_address}`, 20, currentY);
      currentY += 7;
    }
    // ... etc., fill in the rest

    // Save PDF
    doc.save(`LOR_${lorData?.student_info?.name || 'Student'}.pdf`);
  };

  if (loading) {
    return (
      <DashboardLayout role={userRole}>
        <h2>Loading LoR Request #{requestId}...</h2>
      </DashboardLayout>
    );
  }

  if (!lorData) {
    return (
      <DashboardLayout role={userRole}>
        <h2>LoR Request #{requestId} not found.</h2>
      </DashboardLayout>
    );
  }

  const {
    request_id,
    status,
    created_at,
    lor_content,
    universities,
    student_info,
  } = lorData;

  return (
    <DashboardLayout role={userRole}>
      <h2>LoR Request Details</h2>

      <div className="lor-details">
        {/* Request Info */}
        <section>
          <h3>Request Information</h3>
          <p><strong>Request ID:</strong> {request_id}</p>
          <p><strong>Status:</strong> {status}</p>
          <p><strong>Created At:</strong> {new Date(created_at).toLocaleString()}</p>
        </section>

        {/* Student Info */}
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

        {/* LOR Content */}
        <section>
          <h3>LOR Content</h3>
          <p>{lor_content}</p>
        </section>

        {/* Universities */}
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
      {/* TEACHER + PENDING */}
      {userRole === 'teacher' && status === 'PENDING' && (
        <div className="action-buttons">
          <button
            onClick={handleApprove}
            className="approve-btn"
            disabled={actionLoading}
            style={{
              opacity: actionLoading ? 0.6 : 1,
              cursor: actionLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {actionLoading ? 'Approving...' : 'Approve'}
          </button>
          <button
            onClick={handleDecline}
            className="decline-btn"
            disabled={actionLoading}
            style={{
              opacity: actionLoading ? 0.6 : 1,
              cursor: actionLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {actionLoading ? 'Declining...' : 'Decline'}
          </button>
          <button
            onClick={handleApproveAndGenerate}
            className="approve-btn"
            disabled={actionLoading}
            style={{
              opacity: actionLoading ? 0.6 : 1,
              cursor: actionLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {actionLoading ? 'Approving & Generating...' : 'Approve & Generate LOR'}
          </button>
        </div>
      )}

      {/* TEACHER + APPROVED */}
      {userRole === 'teacher' && status === 'APPROVED' && (
        <div className="action-buttons">
          <button
            onClick={handleGenerateLor}
            className="approve-btn"
            disabled={actionLoading}
            style={{
              opacity: actionLoading ? 0.6 : 1,
              cursor: actionLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {actionLoading ? 'Generating...' : 'Generate LoR'}
          </button>
        </div>
      )}

      {/* TEACHER + DECLINED */}
      {userRole === 'teacher' && status === 'DECLINED' && (
        <div className="action-buttons">
          <button
            onClick={handleApprove}
            className="approve-btn"
            disabled={actionLoading}
            style={{
              opacity: actionLoading ? 0.6 : 1,
              cursor: actionLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {actionLoading ? 'Approving...' : 'Re-approve'}
          </button>
        </div>
      )}

      {/* STUDENT + FINISHED -> Download LOR */}
      {userRole === 'student' && status === 'FINISHED' && (
        <div className="action-buttons">
          <button
            onClick={handleFinished}
            className="approve-btn"
            disabled={actionLoading}
            style={{
              opacity: actionLoading ? 0.6 : 1,
              cursor: actionLoading ? 'not-allowed' : 'pointer',
            }}
          >
            {actionLoading ? <>Downloading <FaDownload /></> : <>Download LOR <FaDownload /></>}
          </button>
        </div>
      )}
    </DashboardLayout>
  );
};

export default ViewLoRRequest;
