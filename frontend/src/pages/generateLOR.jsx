import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import { jsPDF } from "jspdf";
import { fetchUserProfile } from "../services/api"; // Import the API function
import { updateLorRequestStatus } from '../services/api';
import "../styles/generateLOR.css";

const GenerateLOR = () => {
  const { requestId } = useParams();
  const [pdfDataUrl, setPdfDataUrl] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { lorData } = location.state || {};
  // State to hold faculty details
  const [facultyDetails, setFacultyDetails] = useState({
    name: "",
    signatureName: "",
    designation: "",
    department: "",
    campus: "",
    email: "",
    phone: "",
  });

  const [lorContent, setLorContent] = useState("Write your LOR content here.");
  const [tempEditedContent, setTempEditedContent] = useState(""); // Temporary storage for edited content
  const [error, setError] = useState("");
  const [usePreviousContent, setUsePreviousContent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false); // To handle button disable state

  // Fetch profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        setFacultyDetails({
          name: profileData.name,
          signatureName: profileData.name,
          designation: profileData.designation,
          department: profileData.department,
          campus: profileData.campus,
          email: profileData.gitamEmail,
          phone: profileData.phone,
        });
      } catch (err) {
        console.error("Error fetching profile data:", err.message);
        setError("Failed to load faculty details. Please try again later.");
      }
    };

    loadProfile();
  }, []);

  const handleCheckboxChange = (e) => {
    setUsePreviousContent(e.target.checked);
    if (e.target.checked && lorData?.lor_content) {
      setTempEditedContent(lorContent);
      setLorContent(lorData.lor_content);
    } else if (!e.target.checked) {
      setLorContent(tempEditedContent);
    }
  };

  const generatePDFContent = () => {
    const doc = new jsPDF();

    // Add Header
    const pageWidth = doc.internal.pageSize.width;
    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("Letter of Recommendation HEADER", pageWidth / 2, 15, { align: "center" });

    // Add Faculty Details
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    let currentY = 50; // Start position
    const lineSpacing = 5;
    doc.text(`${facultyDetails.name}`, 20, currentY);
    currentY += lineSpacing;
    doc.text(`${facultyDetails.designation}`, 20, currentY);
    currentY += lineSpacing;
    doc.text(`${facultyDetails.department}`, 20, currentY);
    currentY += lineSpacing;
    doc.text(`GITAM(Deemed to be University), ${facultyDetails.campus} Campus`, 20, currentY);
    currentY += lineSpacing;
    doc.text(`Email: ${facultyDetails.email}`, 20, currentY);
    currentY += lineSpacing;
    doc.text(`Phone:+91 ${facultyDetails.department}`, 20, currentY);
    currentY += lineSpacing;

    // Add Heading
    currentY += lineSpacing + 10;
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("LETTER OF RECOMMENDATION", pageWidth / 2, currentY, { align: "center" });

    // Add Content
    currentY += lineSpacing + 5;
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(lorContent, 20, currentY, { maxWidth: 170 , align: "justify" });

    // Add "With regards," section before footer
  currentY = doc.internal.pageSize.height - 60; // Adjust to position near footer
  doc.setFontSize(12);
  doc.setFont("times", "normal");
  doc.text("With regards,", 20, currentY);
  currentY += lineSpacing + 3;
  doc.setFont("times", "bold");
  doc.text(`${facultyDetails.signatureName}`, 20, doc.internal.pageSize.height - 37);

  // Add Footer
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.text("LOR FOOTER", pageWidth / 2, pageHeight - 10, {
    align: "center",
  });

    return doc;
  };

  const handlePreviewPDF = () => {
    const doc = generatePDFContent();
    const pdfData = doc.output("datauristring");
    setPdfDataUrl(pdfData);
  };

  const handleDownloadPDF = () => {
    const doc = generatePDFContent();
    doc.save(`LOR_${facultyDetails.name}.pdf`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFacultyDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLorContentChange = (e) => {
    setLorContent(e.target.value);
  };

  const handleFinishLOR = async () => {
    if (!facultyDetails.name) {
      setError("Please enter your name for address.");
      return;
    }
    if (!facultyDetails.signatureName) {
      setError("Please enter your name for signature.");
      return;
    }
    if (!facultyDetails.designation) {
      setError("Please enter your designation.");
      return;
    }
    if (!lorContent) {
      setError("Please enter LOR content.");
      return;
    }
    const confirmFinish = window.confirm(`Are you sure you want to finish editing and send letter to ${lorData.student_info.name}?`);
    if (!confirmFinish) return;

    setActionLoading(true);
    const lorElements = {
      request_id: requestId,
      teacher_id: facultyDetails.id,
      name_address: facultyDetails.name,
      name_signature: facultyDetails.signatureName,
      designation: facultyDetails.designation,
      department: facultyDetails.department,
      campus: facultyDetails.campus,
      email: facultyDetails.email,
      phone: facultyDetails.phone,
      lor_content: lorContent,
    };
    try {
        await updateLorRequestStatus(requestId, { status: 'FINISHED'});
        alert(`LOR sent successfully.`);
    } catch (error) {
      console.error('Error sending LOR:', error);
      alert('Failed to send LOR.');
      return;
    } finally {
      setActionLoading(false);
    }

    // Redirect to dashboard
    navigate("/dashboard/teacher/accept-lor");
  }

  return (
    <DashboardLayout role="faculty">
      <div className="generate-lor-header">
      <h2>Generate LOR
      <label className="generate-lor-checkbox-label">
          <input
            type="checkbox"
            className="generate-lor-checkbox"
            checked={usePreviousContent}
            onChange={handleCheckboxChange}
          />
          Take LOR content from student message
        </label>
        </h2>
      </div>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Editable Fields */}
    <div className="profile-grid">
        <div className="profile-item">
          <label className="labels"> 
            Your Name in Letter address
            <input
              type="text"
              name="name"
              className="generate-lor-input"
              value={facultyDetails.name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div className="profile-item">
          <label className="labels">Your Name for Signature
            <input
              type="text"
              name="signatureName"
              className="generate-lor-input"
              value={facultyDetails.signatureName}
              onChange={handleInputChange}
            />
          </label>
        </div>
      </div>
      <div className="profile-grid">
        <div className="profile-item">
        <label className="labels">
          Your Designation in Letter address
          <input
            type="text"
            name="designation"
            className="generate-lor-input"
            value={facultyDetails.designation}
            onChange={handleInputChange}
          />
        </label>
        </div>
        <div className="profile-item">
          <label className="labels">Student Name
            <input 
              className="generate-lor-input"
              type="text" 
              value={lorData.student_info.name || ''} 
              readOnly 
            />
          </label>
        </div>
      </div>
        <div className="profile-item">
        <label className="labels">
          LOR Content
          <textarea
            value={lorContent}
            onChange={handleLorContentChange}
            rows="10"
            style={{
              fontFamily: "Muli, sans-serif",
              width: "98%",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid var(--border-color)",
            }}
          />
        </label>
        </div>

      {/* Buttons */}
      <div style={{ display: "flex", marginTop: "20px", justifyContent: "space-between" }}>
        <button
          className="generate-lor-btn"
          onClick={handlePreviewPDF}
        >
          Save and Preview LOR
        </button>
        <button
          className="generate-lor-btn finish"
          onClick={handleFinishLOR}
        >
          Finish LOR
        </button>
      </div>

      {/* PDF Preview */}
      {pdfDataUrl && (
        <div className="mt-4">
          <h3 style={{ color: "var(--primary-color)" }}>Preview:</h3>
          <iframe
            src={pdfDataUrl}
            title="PDF Preview"
            style={{ width: "100%", height: "500px", border: "1px solid #ddd" }}
          />
        </div>
      )}
    </DashboardLayout>
  );
};

export default GenerateLOR;
