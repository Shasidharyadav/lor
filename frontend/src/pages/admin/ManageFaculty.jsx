import React, {useState, useRef, useEffect } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { deleteUser, bulkUploadUsers } from '../../services/api';
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { campusToSchools, allDepartments, allSpecializations } from "../../utilities/filterData";
import { FaDownload, FaUpload } from 'react-icons/fa';
import sampleFile from "../../assets/Sample_data_faculty.xlsx";
import successImg from '../../assets/success_img.png';


const ManageFaculty = () => {
    document.title = "Manage Faculty";
    const user = JSON.parse(localStorage.getItem("user")) || {};

    const [selectedFile, setSelectedFile] = useState(null);
    const [parsedRows, setParsedRows] = useState([]);
    const [defaultTeacherPassword, setDefaultTeacherPassword] = useState("test@123");
    const [validationErrors, setValidationErrors] = useState([]);
    const [isValidated, setIsValidated] = useState(false);
    const [activateUpload, setActivateUpload] = useState(false);
    const [showCreatePopup, setShowCreatePopup] = useState(false);

    const [facultyId, setfacultyId] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const confirmDeleteRef = useRef(null);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        function handleClickOutside(event) {
          if (confirmDeleteRef.current && !confirmDeleteRef.current.contains(event.target)) {
            setConfirmDelete(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);

    const handleDeleteChange = (e) => {
        setfacultyId(e.target.value);
    };

    const handleConfirmDelete = () => {
        if (facultyId === "") {
            setError("Please enter an Employee ID.");
            return;
        }
        setError("");
        setConfirmDelete(true);
    };

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
          if (!value.endsWith("@gitam.edu")) {
            return "Faculty GITAM Email Id must end with @gitam.edu.";
          }
        }
        if (key === "name") {
          if (!/^[a-zA-Z ]+$/.test(value)) {
            return "Name must contain only alphabets and spaces.";
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
          const visibleKeys = Object.keys(row);
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

    const teacherRows = parsedRows;

    // --- Styles ---
  const tableContainerStyle = {
    overflowX: "auto",
    marginTop: "20px",
  };

  const tableStyle = {
    // width: "100%",
    // tableLayout: "fixed",
    // borderCollapse: "collapse",
    // marginBottom: "20px",
    
  };

  const thStyle = {
    padding: "12px 15px",
    width: "fit-content",
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
            // const role = row.role?.toLowerCase();
            let newRow = { ...row,
                role: "teacher" ,
                id: row["ID"],
                gitamEmail: row["Email"],
                name: row["Name"],
                campus: row["Campus"],
                school: row["School"],
                department: row["Dept."],    
                specialization: row["Spec"],
                phone: row["Phone"],
                designation: row["Designation"]

            };
            if (!newRow.password) {
                newRow.password = defaultTeacherPassword;
            }
            return newRow;
        });
  
      try {
        await bulkUploadUsers({ data: updatedRows });
        setShowCreatePopup(true);
        setSelectedFile(null);
        setParsedRows([]);
        setValidationErrors([]);
        setIsValidated(false);
        setTimeout(() => setShowCreatePopup(false), 2000);
      } catch (err) {
        alert("Error uploading data: " + err.message);
      }
    };

    const handleDelete = async () => {
        try {
          console.log("Deleting faculty with ID:", facultyId);
          await deleteUser(facultyId);
          setfacultyId("");
          setError("");
          setConfirmDelete(false);
          setShowDeletePopup(true);
          setTimeout(() => setShowDeletePopup(false), 2000);
        } catch (err) {
            console.error("Error deleting faculty:", err);
            alert(err);
        }
      };


    return(
        <DashboardLayout>
            <h2>Manage Faculty</h2>
            <div className='admin-form-whole'>
                <div className='admin-form'>
                    <h3>Add Faculty(.xlsx or .csv)
                        <br/>
                        {/* Sample File Download Link */}
                        <a
                            href={sampleFile}
                            download="sample_faculty.xlsx"
                            style={{ display: "block",  color: "var(--primary-color)", textDecoration: "underline", cursor: "pointer", fontSize: "13px" }}
                        >
                            <FaDownload />Download Sample File
                        </a></h3>
                    <br/>
                    <div className="upload-buttons">
                        <div className='files-handle'>
                        <div className="choose-file">
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileSelect}
                                // class="hide_file"
                            />
                        </div>
                        </div>
                        <button className="add-users-button upload" onClick={handleParse} disabled={!activateUpload}>
                            <FaUpload />Upload
                        </button>
                    </div>
                    {teacherRows.length > 0 && (
                        <div className="default-password" style={{ marginTop: "10px" }}>
                            <label className='labels'>
                                Default Password for Faculty:</label>
                            <input
                                type="text"
                                value={defaultTeacherPassword}
                                onChange={(e) => setDefaultTeacherPassword(e.target.value)}
                                style={{ marginLeft: "5px" }}
                            />
                        </div>
                    )}
                    {/* Validate Data Button */}
                    <div style={{ marginTop: "20px"}}>
                        <button className="add-users-button validate" onClick={validateData}>
                            Validate Data
                        </button>
                    </div>
                    <br />
                    {/* Confirm & Save button only visible when data is validated */}
                    {isValidated && (
                        <div>
                        <button className="submit-btn" onClick={handleSubmit} style={{marginTop: '30px', padding: '15px 25px', minWidth: '100%'}}>
                            Confirm & Save
                        </button>
                        </div>
                    )}
                </div>
                <div className='admin-form'>
                    <h3>Delete Faculty</h3>
                    <label className='labels'>Employee ID</label>
                    <input 
                        type="text" 
                        className='credentials' 
                        value={facultyId}
                        onChange={handleDeleteChange} 
                        placeholder='Enter Employee ID' 
                    />
                    <span className='error'>{error}</span>  
                    <button
                        type="submit"
                        className='submit-btn delete'
                        style={{marginTop: '30px', padding: '13px 25px', minWidth: '100%'}}
                        onClick={handleConfirmDelete}
                    >
                        Delete Faculty</button>
                </div>
            </div>
            {/* Error Table for Validation Errors */}
            {validationErrors.length > 0 && (
            <div style={tableContainerStyle}>
                <h3>Validation Errors</h3>
                <table className="custom-table" style={tableStyle}>
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

            {/* Teachers Preview Table */}
            {teacherRows.length > 0 && (
            <div style={tableContainerStyle}>
            <h3 style={{color:"var(--primary-color)"}}>Faculty Preview & Edit</h3>
            <table className="table" style={tableStyle}>
            <thead>
              <tr>
                {Object.keys(teacherRows[0]).map((key) => (
                    <th key={key} style={thStyle}>
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {teacherRows.map((row) => {
                const rowIndex = parsedRows.findIndex((r) => r.id === row.id);
                const keys = Object.keys(row)
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

        {/* Confirm delete dialog */}
        {confirmDelete && (
        <div className="confirm-delete" ref={confirmDeleteRef}>
            <p>Are you sure you want to PERMENANTLY delete this faculty?</p>
            <div className='confirm-delete-buttons'>
                <button onClick={() => setConfirmDelete(false)} className='buttons cancel'>Cancel</button>
                <button className='buttons delete' onClick={handleDelete}>Delete</button>
            </div>
        </div>
        )}
              
        {/* Popup Notification */}
        {showDeletePopup && (
        <div className="popup-success">
            <img src={successImg} alt="Success" />
            <span>Faculty deleted successfully!</span>
            </div>
        )}

        {/* Popup Notification */}
        {showCreatePopup && (
        <div className="popup-success">
            <img src={successImg} alt="Success" />
            <span>Faculty added successfully!</span>
            </div>
        )}

        </DashboardLayout>
    )

};

export default ManageFaculty;