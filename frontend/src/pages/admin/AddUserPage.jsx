import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { campusToSchools, allDepartments, allSpecializations } from "../../utilities/filterData";
import { bulkUploadUsers } from "../../services/api"; // Using your API function
import {FaUpload} from 'react-icons/fa';

const AddUserPage = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};

  // States for file, parsed data, default passwords, and validation state
  const [selectedFile, setSelectedFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [defaultStudentPassword, setDefaultStudentPassword] = useState("test@123");
  const [defaultTeacherPassword, setDefaultTeacherPassword] = useState("test@123");
  const [validationErrors, setValidationErrors] = useState([]);
  const [isValidated, setIsValidated] = useState(false);
  const [activateUpload, setActivateUpload] = useState(false);

  // Columns to exclude from preview for each role
  const studentExcludedColumns = ["phone", "designation", "password"];
  const teacherExcludedColumns = ["yearOfPassout", "personalEmail", "password"];

  // --- File Parsing ---
  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
    setActivateUpload(true);
  };

  const handleParse = () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    const fileName = selectedFile.name.toLowerCase();
    if (fileName.endsWith(".csv")) {
      parseCSV(selectedFile);
    } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
      parseExcel(selectedFile);
    } else {
      alert("Unsupported file format. Please upload .csv, .xlsx, or .xls");
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedRows(results.data);
        setValidationErrors([]);
        setIsValidated(false);
      },
      error: (err) => {
        alert("Error parsing CSV file!");
      },
    });
  };

  const parseExcel = (file) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsName = wb.SheetNames[0];
      const ws = wb.Sheets[wsName];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "", raw: true });
      setParsedRows(data);
      setValidationErrors([]);
      setIsValidated(false);
    };
    reader.readAsBinaryString(file);
  };

  // --- Validation Function ---
  // validateFieldValue returns an error message string if invalid, otherwise empty string.
  const validateFieldValue = (key, row) => {
    const value = row[key] ? row[key].toString().trim() : "";
    if (value === "") {
      return `${key} is required.`;
    }
    if (key === "id") {
      if (!/^[a-zA-Z0-9]+$/.test(value)) {
        return "ID must be alphanumeric.";
      }
    }
    if (key === "gitamEmail") {
      if (!value.includes("@") || !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return "Invalid email format.";
      }
      if (row.role?.toLowerCase() === "teacher" && !value.endsWith("@gitam.edu")) {
        return "Teacher GITAM Email must end with @gitam.edu.";
      }
      if (row.role?.toLowerCase() === "student" && !value.match(/@(gitam\.edu|gitam\.in)$/i)) {
        return "Student GITAM Email must end with @gitam.edu or @gitam.in.";
      }
    }
    if (key === "name") {
      if (!/^[a-zA-Z ]+$/.test(value)) {
        return "Name must contain only alphabets and spaces.";
      }
    }
    if (key === "personalEmail" && row.role?.toLowerCase() === "student") {
      if (!value.includes("@") || !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        return "Invalid personal email format.";
      }
      if (value.match(/@(gitam\.edu|gitam\.in)$/i)) {
        return "Personal Email should not be a Gitam email.";
      }
    }
    if (key === "campus") {
      if (!Object.keys(campusToSchools).includes(value)) {
        return "Invalid campus.";
      }
    }
    if (key === "school") {
      if (!campusToSchools[row.campus]?.includes(value)) {
        return "Invalid school for the selected campus.";
      }
    }
    if (key === "department") {
      if (!allDepartments[row.school]?.includes(value)) {
        return "Invalid department for the selected school.";
      }
    }
    if (key === "specialization") {
      if (!allSpecializations[row.department]?.includes(value)) {
        return "Invalid specialization for the selected department.";
      }
    }
    return "";
  };

  // Validate all rows and store errors in state.
  const validateData = () => {
    const errorsList = [];
    parsedRows.forEach((row, index) => {
      const role = row.role?.toLowerCase();
      const visibleKeys =
        role === "student"
          ? Object.keys(row).filter((key) => !studentExcludedColumns.includes(key))
          : role === "teacher"
          ? Object.keys(row).filter((key) => !teacherExcludedColumns.includes(key))
          : [];
      const rowErrors = {};
      visibleKeys.forEach((key) => {
        const errorMsg = validateFieldValue(key, row);
        if (errorMsg) {
          rowErrors[key] = errorMsg;
        }
      });
      if (Object.keys(rowErrors).length > 0) {
        errorsList.push({
          id: row.id || `Row ${index + 1}`,
          role: row.role,
          errors: rowErrors,
        });
      }
    });
    setValidationErrors(errorsList);
    // If no errors, mark as validated.
    if (errorsList.length === 0 && parsedRows.length > 0) {
      setIsValidated(true);
      alert("Data is valid. You may now confirm & save.");
    } else {
      setIsValidated(false);
      alert("There are validation errors. Please correct them before proceeding.");
    }
    return errorsList;
  };

  // --- Table Preview Editing ---
  const handleCellChange = (e, rowIndex, key) => {
    const newVal = e.target.value;
    setParsedRows((old) => {
      const updated = [...old];
      updated[rowIndex] = { ...updated[rowIndex], [key]: newVal };
      return updated;
    });
    // Reset validation status since data has changed
    setIsValidated(false);
  };

  // Separate rows by role for preview
  const studentRows = parsedRows.filter(
    (row) => row.role?.toLowerCase() === "student"
  );
  const teacherRows = parsedRows.filter(
    (row) => row.role?.toLowerCase() === "teacher"
  );

  // --- Styles ---
  const tableContainerStyle = {
    overflowX: "auto",
    marginTop: "20px",
  };

  const tableStyle = {
    width: "100%",
    tableLayout: "fixed",
    borderCollapse: "collapse",
    marginBottom: "20px",
  };

  const thStyle = {
    padding: "12px 15px",
    backgroundColor: "var(--primary-color)",
    color: "var(--secondary-color)",
    textAlign: "left",
  };

  const tdStyle = {
    padding: "12px 15px",
    color: "var(--text-color)",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    border: "none",
    outline: "none",
    background: "transparent",
    padding: "4px",
  };

  // --- Submission ---
  const handleSubmit = async () => {
    if (!isValidated) {
      alert("Please validate your data first.");
      return;
    }
    if (!parsedRows.length) {
      alert("No rows to submit!");
      return;
    }
    const updatedRows = parsedRows.map((row) => {
      const role = row.role?.toLowerCase();
      let newRow = { ...row };
      if (role === "student") {
        studentExcludedColumns.forEach((key) => delete newRow[key]);
        if (!newRow.password) {
          newRow.password = defaultStudentPassword;
        }
      } else if (role === "teacher") {
        teacherExcludedColumns.forEach((key) => delete newRow[key]);
        if (!newRow.password) {
          newRow.password = defaultTeacherPassword;
        }
      }
      return newRow;
    });

    try {
      await bulkUploadUsers({ data: updatedRows });
      alert("Data uploaded successfully!");
      setSelectedFile(null);
      setParsedRows([]);
      setValidationErrors([]);
      setIsValidated(false);
    } catch (err) {
      alert("Error uploading data: " + err.message);
    }
  };

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2>Add Faculty/Students through Bulk Upload (XLSX or CSV)</h2>
      <div className="upload-buttons">
        <div className="choose-file">
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            // class="hide_file"
          />
        </div>
        <button className="add-users-button upload" onClick={handleParse} disabled={!activateUpload}>
          <FaUpload />Upload
        </button>
      </div>

      {/* Default Password Inputs */}
      {studentRows.length > 0 && (
        <div className="default-password" style={{ marginTop: "10px" }}>
          <label>
            Default Password for Students:
            <input
              type="text"
              value={defaultStudentPassword}
              onChange={(e) => setDefaultStudentPassword(e.target.value)}
              style={{ marginLeft: "5px" }}
            />
          </label>
        </div>
      )}
      {teacherRows.length > 0 && (
        <div className="default-password" style={{ marginTop: "10px" }}>
          <label>
            Default Password for Teachers:
            <input
              type="text"
              value={defaultTeacherPassword}
              onChange={(e) => setDefaultTeacherPassword(e.target.value)}
              style={{ marginLeft: "5px" }}
            />
          </label>
        </div>
      )}

      {/* Validate Data Button */}
      <div style={{ marginTop: "20px" }}>
        <button className="add-users-button validate" onClick={validateData}>
          Validate Data
        </button>
      </div>

      {/* Error Table for Validation Errors */}
      {validationErrors.length > 0 && (
        <div style={tableContainerStyle}>
          <h3>Validation Errors</h3>
          <table className="table" style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Errors</th>
              </tr>
            </thead>
            <tbody>
              {validationErrors.map((errObj, idx) => (
                <tr key={idx}>
                  <td style={tdStyle}>{errObj.id}</td>
                  <td style={tdStyle}>{errObj.role}</td>
                  <td style={tdStyle}>
                    {Object.entries(errObj.errors).map(([field, msg]) => (
                      <div key={field}>
                        <strong>{field}:</strong> {msg}
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Students Preview Table */}
      {studentRows.length > 0 && (
        <div style={tableContainerStyle}>
          <h3>Students Preview & Edit</h3>
          <table className="table" style={tableStyle}>
            <thead>
              <tr>
                {Object.keys(studentRows[0])
                  .filter((key) => !studentExcludedColumns.includes(key))
                  .map((key) => (
                    <th key={key} style={thStyle}>
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {studentRows.map((row) => {
                const rowIndex = parsedRows.findIndex((r) => r.id === row.id);
                const keys = Object.keys(row).filter(
                  (key) => !studentExcludedColumns.includes(key)
                );
                return (
                  <tr key={rowIndex}>
                    {keys.map((key) => (
                      <td key={key} style={tdStyle}>
                        <input
                          className="input-field"
                          value={row[key]}
                          onChange={(e) => handleCellChange(e, rowIndex, key)}
                          style={{
                            ...inputStyle,
                            borderColor: validateFieldValue(key, row)
                              ? "transparent"
                              : "red",
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Teachers Preview Table */}
      {teacherRows.length > 0 && (
        <div style={tableContainerStyle}>
          <h3>Teachers Preview & Edit</h3>
          <table className="table" style={tableStyle}>
            <thead>
              <tr>
                {Object.keys(teacherRows[0])
                  .filter((key) => !teacherExcludedColumns.includes(key))
                  .map((key) => (
                    <th key={key} style={thStyle}>
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {teacherRows.map((row) => {
                const rowIndex = parsedRows.findIndex((r) => r.id === row.id);
                const keys = Object.keys(row).filter(
                  (key) => !teacherExcludedColumns.includes(key)
                );
                return (
                  <tr key={rowIndex}>
                    {keys.map((key) => (
                      <td key={key} style={tdStyle}>
                        <input
                          className="input-field"
                          value={row[key]}
                          onChange={(e) => handleCellChange(e, rowIndex, key)}
                          style={{
                            ...inputStyle,
                            borderColor: validateFieldValue(key, row)
                              ? "transparent"
                              : "red",
                          }}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Confirm & Save button only visible when data is validated */}
      {isValidated && (
        <button className="buttons submit-btn" onClick={handleSubmit}>
          Confirm & Save
        </button>
      )}
    </DashboardLayout>
  );
};

export default AddUserPage;
