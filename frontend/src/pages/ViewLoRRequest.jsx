// src/pages/ViewLoRRequest.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import {
  getLorRequestDetails,
  updateLorRequestStatus,
} from '../services/api';
import { jsPDF } from 'jspdf';
import "../styles/ViewLoRRequest.css";
import { FaDownload } from 'react-icons/fa';
import lorHeader from "../assets/lor_header.jpg";
import lorFooter from "../assets/lor_footer.jpg";

const ViewLoRRequest = () => {
  document.title = 'View LOR Requests';

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

  // TEACHER Approve / Decline logic (unchanged) ...
  const handleApprove = async () => {
    if (!window.confirm(`Are you sure you want to APPROVE request #${requestId}?`)) return;
    setActionLoading(true);
    try {
      await updateLorRequestStatus(requestId, { status: 'ACCEPTED' });
      alert(`Request #${requestId} accepted successfully.`);
      navigate('/teacher/pending-requests'); 
    } catch (error) {
      console.error('Error approving LoR request:', error);
      alert('Failed to approve LoR request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleApproveAndGenerate = async () => {
    if (!window.confirm(`Are you sure you want to APPROVE request #${requestId} and generate LoR?`)) return;
    setActionLoading(true);
    try {
      await updateLorRequestStatus(requestId, { status: 'ACCEPTED' });
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

  const handleDecline = async () => {
    if (!window.confirm(`Are you sure you want to DECLINE request #${requestId}?`)) return;
    setActionLoading(true);
    try {
      await updateLorRequestStatus(requestId, { status: 'DECLINED' });
      alert(`Request #${requestId} declined successfully.`);
      navigate('/teacher/pending-requests');
    } catch (error) {
      console.error('Error declining LoR request:', error);
      alert('Failed to decline LoR request.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateLor = () => {
    navigate(`/teacher/generate-lor/${requestId}`, {
      state: { lorData },
    });
  };

  // STUDENT can download if status=FINISHED
  const handleFinished = () => {
    if (!lorData) return;
    // PDF logic is unchanged ...
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 25;
    const pageHeight = doc.internal.pageSize.height;
    doc.addImage(lorHeader, 'JPG', 0, 0, pageWidth, 50);
    doc.addImage(lorFooter, 'JPG', 0, pageHeight - 15, pageWidth, 15);

    doc.setFontSize(12);
    doc.setFont("times", "bold");
    let currentY = 65;
    const lineSpacing = 5;
    
    doc.text(`${lorData.name_address}`, 25, currentY);
    currentY += lineSpacing;
    doc.text(`${lorData.teacher_designation}`, 25, currentY);
    currentY += lineSpacing;
    doc.text(`${lorData.teacher_department}`, 25, currentY);
    currentY += lineSpacing;
    doc.text(
      `GITAM(Deemed to be University), ${lorData.teacher_campus} Campus`,
      25,
      currentY
    );
    currentY += lineSpacing;
    doc.text(`Email: ${lorData.teacher_email}`, 25, currentY);
    currentY += lineSpacing;
    doc.text(`Phone:+91 ${lorData.teacher_phone}`, 25, currentY);
    currentY += lineSpacing;
    
    currentY += lineSpacing + 10;
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    const headingText = "LETTER OF RECOMMENDATION";
    doc.text(headingText, pageWidth / 2, currentY, { align: "center" });
    const textWidth = doc.getTextWidth(headingText);
    const startX = (pageWidth - textWidth) / 2;
    doc.setLineWidth(0.5);
    doc.line(startX, currentY + 1, startX + textWidth, currentY + 1);
    
    currentY += lineSpacing + 5;
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(lorData.lor_content, 25, currentY, {
      maxWidth: pageWidth - 2 * margin,
      align: "justify",
    });
    
    currentY = doc.internal.pageSize.height - 60;
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text("With regards,", 25, currentY);
    currentY += lineSpacing + 3;
    doc.setFont("times", "bold");
    doc.text(`${lorData.name_signature}`, 25, doc.internal.pageSize.height - 37);

    doc.save(`LOR_${lorData?.name_signature || 'Student'}.pdf`);
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
    teacher_id,
    teacher_info, // NEW from backend
    name_signature,
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

        {/* Faculty Info - Only visible if userRole === "student" */}
        {userRole === 'student' && teacher_info && (
          <section>
            <h3>Faculty Information</h3>
            <div className="student-profile">
              <p><strong>ID:</strong> {teacher_info.id}</p>
              <p><strong>Name:</strong> {teacher_info.name}</p>
              {/* You could also show teacher_info.email, teacher_info.campus, etc. */}
            </div>
          </section>
        )}

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

      {/* Action Buttons (unchanged) */}
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

      {userRole === 'teacher' && status === 'ACCEPTED' && (
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
