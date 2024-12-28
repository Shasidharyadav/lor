import React, { useState, useEffect } from "react";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import { jsPDF } from "jspdf";
import { fetchUserProfile } from "../services/api"; // Import the API function

const GenerateLOR = () => {
  const [pdfDataUrl, setPdfDataUrl] = useState(null);

  // State to hold faculty details
  const [facultyDetails, setFacultyDetails] = useState({
    name: "",
    designation: "",
    department: "",
    campus: "",
    email: "",
    phone: "",
  });

  const [lorContent, setLorContent] = useState(
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum molestias dicta autem totam? Officia debitis quia necessitatibus deserunt quod. Laudantium perspiciatis quos nam, placeat earum, libero adipisci voluptatibus veritatis, a sapiente illum quisquam obcaecati fugiat laboriosam dignissimos. Placeat perferendis at ullam neque, ratione excepturi praesentium ipsam sapiente commodi eaque totam."
  );

  const [error, setError] = useState("");

  // Fetch profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        setFacultyDetails({
          name: profileData.name,
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
  doc.text(`${facultyDetails.name}`, 20, doc.internal.pageSize.height - 37);

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

  return (
    <DashboardLayout role="faculty">
      <h2>Generate LOR</h2>

      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Editable Fields */}
      <div style={{ marginTop: "20px" }}>
        <label className="labels"> 
          Faculty Name
          <input
            type="text"
            name="name"
            value={facultyDetails.name}
            onChange={handleInputChange}
            style={{ width: "98%", padding: "10px", marginBottom: "10px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
          />
        </label>
        <label className="labels">
          Designation
          <input
            type="text"
            name="designation"
            value={facultyDetails.designation}
            onChange={handleInputChange}
            style={{ width: "98%", padding: "10px", marginBottom: "10px", borderRadius: "4px", border: "1px solid var(--border-color)" }}
          />
        </label>
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
          style={{
            flex: "1",
            padding: "10px",
            margin: "0 5px",
            background: "var(--primary-color)",
            color: "var(--secondary-color)",
            border: "none",
            borderRadius: "4px",
          }}
          onClick={handlePreviewPDF}
        >
          Save and Preview LOR
        </button>
        <button
          style={{
            flex: "1",
            padding: "10px",
            margin: "0 5px",
            background: "var(--primary-color)",
            color: "var(--secondary-color)",
            border: "none",
            borderRadius: "4px",
          }}
          onClick={handleDownloadPDF}
        >
          Download LOR PDF
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
