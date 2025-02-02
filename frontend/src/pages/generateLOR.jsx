import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import { jsPDF } from "jspdf";
import { fetchUserProfile, finalizeLorRequest, saveLoRContent } from "../services/api";
import "../styles/generateLOR.css";
import { FaFileExport } from "react-icons/fa";
import lorHeader from "../assets/lor_header.jpg";
import lorFooter from "../assets/lor_footer.jpg";

const GenerateLOR = () => {
  document.title = 'Generate LOR';
  const { requestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { lorData } = location.state || {};

  // State to hold faculty details
  const [facultyDetails, setFacultyDetails] = useState({
    id: "",
    name: "",
    signatureName: "",
    department: "",
    campus: "",
    email: "",
    phone: "",
  });

  // This is the teacher’s LOR content (editable)
  const [lorContent, setLorContent] = useState("");
  const [tempEditedContent, setTempEditedContent] = useState("");
  const [error, setError] = useState("");
  const [usePreviousContent, setUsePreviousContent] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pdfDataUrl, setPdfDataUrl] = useState(null);

  // Fetch profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        setFacultyDetails({
          id: profileData.id,
          name: profileData.name,
          signatureName: profileData.name, // default signature
          department: profileData.department,
          campus: profileData.campus,
          email: profileData.gitamEmail,
          phone: profileData.phone,
        });

         // If lorData.lor_content exists, use it as default and check the checkbox
         if (lorData?.lor_content) {
          setLorContent(lorData.lor_content);
          setUsePreviousContent(true);
        } else {
          setLorContent("Write your LOR content here.");
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching profile data:", err.message);
        setError("Failed to load faculty details. Please try again later.");
        setLoading(false);
      }
    };
    loadProfile();
  }, []);


  // If user wants to use the student's message for LOR content
  const handleCheckboxChange = (e) => {
    setUsePreviousContent(e.target.checked);
    if (e.target.checked && lorData?.lor_content) {
      setTempEditedContent(lorContent);
      setLorContent(lorData.lor_content);
    } else if (!e.target.checked) {
      setLorContent(tempEditedContent);
    }
  };

  // Generate the PDF content
  const generatePDFContent = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const margin = 25;
    const pageHeight = doc.internal.pageSize.height;

    // Header and Footer
    doc.addImage(lorHeader, "JPG", 0, 0, pageWidth, 50); 
    doc.addImage(lorFooter, "JPG", 0, pageHeight - 15, pageWidth, 15); 

    // Faculty (Teacher) Details
    doc.setFontSize(12);
    doc.setFont("times", "bold");
    let currentY = 65;
    const lineSpacing = 5;

    doc.text(`${facultyDetails.name}`, margin, currentY);
    currentY += lineSpacing;
    // Instead of teacher’s designation, we no longer show that here (per your request)
    doc.text(`${facultyDetails.department}`, margin, currentY);
    currentY += lineSpacing;
    doc.text(
      `GITAM(Deemed to be University), ${facultyDetails.campus} Campus`,
      margin,
      currentY
    );
    currentY += lineSpacing;
    doc.text(`Email: ${facultyDetails.email}`, margin, currentY);
    currentY += lineSpacing;
    doc.text(`Phone:+91 ${facultyDetails.phone}`, margin, currentY);
    currentY += lineSpacing;

    // Heading
    currentY += lineSpacing + 10;
    doc.setFont("times", "bold");
    doc.setFontSize(16);
    doc.text("LETTER OF RECOMMENDATION", pageWidth / 2, currentY, {
      align: "center",
    });

    // Content
    currentY += lineSpacing + 5;
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    doc.text(lorContent, margin, currentY, {
      maxWidth: pageWidth - 2 * margin,
      align: "justify",
    });

    // Signature area
    currentY = doc.internal.pageSize.height - 60;
    doc.setFontSize(12);
    doc.setFont("times", "normal");
    doc.text("With regards,", margin, currentY);
    currentY += lineSpacing + 3;
    doc.setFont("times", "bold");
    doc.text(
      `${facultyDetails.signatureName}`,
      margin,
      doc.internal.pageSize.height - 37
    );

    return doc;
  };

  // Preview PDF
  const handleSaveAndPreviewPDF = async () => {
    try {
      // Save LOR content to backend
      await saveLoRContent(requestId, lorContent);
  
      // Generate PDF after saving
      const doc = generatePDFContent();
      const pdfData = doc.output("datauristring");
      setPdfDataUrl(pdfData);
    } catch (error) {
      console.error("Error saving LOR content:", error);
      alert("Failed to save LOR content. Please try again.");
    }
  };

  // Input changes for faculty details
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFacultyDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // LOR content changes
  const handleLorContentChange = (e) => {
    setLorContent(e.target.value);
  };

  // Finalize the LOR (send to server)
  const handleFinishLOR = async () => {
    if (!facultyDetails.name) {
      setError("Please enter your name for address.");
      return;
    }
    if (!facultyDetails.signatureName) {
      setError("Please enter your name for signature.");
      return;
    }
    if (!lorContent) {
      setError("Please enter LOR content.");
      return;
    }

    const confirmFinish = window.confirm(
      `Are you sure you want to finish editing and send letter to ${lorData?.student_info?.name}?`
    );
    if (!confirmFinish) return;

    setError("");
    setActionLoading(true);

    // We no longer send "teacher_designation"
    const finalizeData = {
      lor_content: lorContent,
      name_address: facultyDetails.name,
      name_signature: facultyDetails.signatureName,
      teacher_department: facultyDetails.department,
      teacher_campus: facultyDetails.campus,
      teacher_email: facultyDetails.email,
      teacher_phone: facultyDetails.phone,
    };

    try {
      // finalizeLorRequest sets status to FINISHED
      await finalizeLorRequest(requestId, finalizeData);

      alert("LOR sent successfully.");
      // Navigate back to teacher accept-lor page
      navigate("/teacher/accept-lor");
    } catch (error) {
      console.error("Error sending LOR:", error);
      alert("Failed to send LOR.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="teacher">
        <div>Loading faculty details...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="teacher">
      <div className="generate-lor-header">
        <h2>
          Generate LOR
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
          <label className="labels">
            Your Name for Signature
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

      {/* NEW: Show the student's title (read-only) */}
      <div className="profile-grid">
        <div className="profile-item">
          <label className="labels">
            Student Title
            <input
              className="generate-lor-input"
              type="text"
              value={lorData?.title || ""}
              readOnly
            />
          </label>
        </div>
        <div className="profile-item">
          <label className="labels">
            Student Name
            <input
              className="generate-lor-input"
              type="text"
              value={lorData?.student_info?.name || ""}
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
      <div
        style={{ display: "flex", marginTop: "20px", justifyContent: "space-between" }}
      >
        <button className="generate-lor-btn" onClick={handleSaveAndPreviewPDF}>
          Save and Preview LOR
        </button>
        <button
          className="generate-lor-btn finish"
          onClick={handleFinishLOR}
          disabled={actionLoading}
        >
          <FaFileExport /> Finish LOR
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
