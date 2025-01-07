import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import {
  fetchApplyLorMetadata,
  createLorRequest // <-- import the function that does POST /apply-lor
} from '../services/api';
import "../styles/global.css";
import "../styles/ApplyLoR.css";

const MAX_UNIV = 7;

const ApplyLoR = () => {
  // 1) Capture the passed faculty from the previous page (FacultyProfiles)
  const location = useLocation();
  const passedFaculty = location.state?.faculty || null;

  // MASTER teacher list from DB
  const [teacherList, setTeacherList] = useState([]);

  // The user's step-by-step selections
  const [selections, setSelections] = useState({
    campus: "",
    school: "",
    department: "",
    specialization: "",
    facultyId: "",
    lorContent: ""
  });

  // Dropdown options
  const [campusOptions, setCampusOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);

  // Right side: universities
  const [universities, setUniversities] = useState([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [selectedUnivs, setSelectedUnivs] = useState([]);

  // Retrieve the student info from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const studentId = userData?.id; // e.g. "ST123"

  // 1) Load teacher_users from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. fetch metadata (includes facultyList, etc.)
        const data = await fetchApplyLorMetadata();
        const tList = data.facultyList || [];
        setTeacherList(tList);

        // 2. build campus list
        const uniqueCampuses = Array.from(
          new Set(tList.map((t) => t.campus).filter(Boolean))
        ).sort();
        setCampusOptions(uniqueCampuses);

        // 3. also load universities from public folder
        const uniRes = await fetch("/universities.json");
        const uniData = await uniRes.json();
        setUniversities(uniData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // 2) Once teacherList is loaded, if we have `passedFaculty`, auto-populate
  useEffect(() => {
    if (passedFaculty && teacherList.length > 0) {
      setSelections((prev) => ({
        ...prev,
        campus: passedFaculty.campus || "",
        school: passedFaculty.school || "",
        department: passedFaculty.department || "",
        specialization: passedFaculty.specialization || "",
        facultyId: passedFaculty.id || ""
      }));
    }
  }, [passedFaculty, teacherList]);

  // 3) Cascading logic
  useEffect(() => {
    if (!selections.campus) {
      setSchoolOptions([]);
      setDepartmentOptions([]);
      setSpecializationOptions([]);
      setFilteredFaculty([]);
      return;
    }
    const campusRows = teacherList.filter((t) => t.campus === selections.campus);
    const uniqueSchools = [...new Set(campusRows.map((t) => t.school).filter(Boolean))].sort();
    setSchoolOptions(uniqueSchools);
  }, [selections.campus, teacherList]);

  useEffect(() => {
    if (!selections.campus || !selections.school) {
      setDepartmentOptions([]);
      setSpecializationOptions([]);
      setFilteredFaculty([]);
      return;
    }
    const rows = teacherList.filter(
      (t) => t.campus === selections.campus && t.school === selections.school
    );
    const uniqueDepts = [...new Set(rows.map((r) => r.department).filter(Boolean))].sort();
    setDepartmentOptions(uniqueDepts);
  }, [selections.school, selections.campus, teacherList]);

  useEffect(() => {
    if (!selections.campus || !selections.school || !selections.department) {
      setSpecializationOptions([]);
      setFilteredFaculty([]);
      return;
    }
    const rows = teacherList.filter(
      (t) =>
        t.campus === selections.campus &&
        t.school === selections.school &&
        t.department === selections.department
    );
    const uniqueSpecs = [...new Set(rows.map((r) => r.specialization).filter(Boolean))].sort();
    setSpecializationOptions(uniqueSpecs);
  }, [selections.department, selections.campus, selections.school, teacherList]);

  useEffect(() => {
    if (
      !selections.campus ||
      !selections.school ||
      !selections.department ||
      !selections.specialization
    ) {
      setFilteredFaculty([]);
      return;
    }
    const finalRows = teacherList.filter(
      (t) =>
        t.campus === selections.campus &&
        t.school === selections.school &&
        t.department === selections.department &&
        t.specialization === selections.specialization
    );
    setFilteredFaculty(finalRows);
  }, [
    selections.specialization,
    selections.campus,
    selections.school,
    selections.department,
    teacherList
  ]);

  // If user changes something in the middle
  const handleSelectionChange = (e) => {
    const { name, value } = e.target;
    if (name === "campus") {
      setSelections({
        ...selections,
        campus: value,
        school: "",
        department: "",
        specialization: "",
        facultyId: "",
        lorContent: selections.lorContent
      });
    } else if (name === "school") {
      setSelections({
        ...selections,
        school: value,
        department: "",
        specialization: "",
        facultyId: "",
        lorContent: selections.lorContent
      });
    } else if (name === "department") {
      setSelections({
        ...selections,
        department: value,
        specialization: "",
        facultyId: "",
        lorContent: selections.lorContent
      });
    } else if (name === "specialization") {
      setSelections({
        ...selections,
        specialization: value,
        facultyId: "",
        lorContent: selections.lorContent
      });
    } else {
      setSelections({
        ...selections,
        [name]: value
      });
    }
  };

  // Submit LoR
  const handleSubmitLoR = async (e) => {
    e.preventDefault();
    if (!selections.facultyId) {
      alert("Please select a faculty.");
      return;
    }
    if (!selections.lorContent.trim()) {
      alert("Please provide LOR content.");
      return;
    }
    if (!studentId) {
      alert("Could not find student ID in local storage.");
      return;
    }
    // NEW CHECK: At least one university should be selected
    if (selectedUnivs.length === 0) {
      alert("Please select at least one university.");
      return;
    }

    const payload = {
      teacher_id: selections.facultyId,
      student_id: studentId,    // from local storage
      campus: selections.campus,
      school: selections.school,
      department: selections.department,
      specialization: selections.specialization,
      lor_content: selections.lorContent,
      universities: selectedUnivs
    };

    try {
      // Actually send the request to your backend
      // using createLorRequest from services/api
      const response = await createLorRequest(payload);
      // e.g., response might be { message: "LoR request submitted", request_id: ... }
      alert(response.message || 'LoR request submitted successfully!');
      
      // Reset if desired
      setSelections({
        campus: "",
        school: "",
        department: "",
        specialization: "",
        facultyId: "",
        lorContent: ""
      });
      setSelectedUnivs([]);
    } catch (error) {
      console.error("Error submitting LoR:", error);
      alert("Failed to submit LoR request. Check console for details.");
    }
  };

  // Filter universities
  const filteredUnivs = universities.filter((uni) => {
    const matchCountry = uni.country.toLowerCase().includes(countrySearch.toLowerCase());
    const matchName = uni.name.toLowerCase().includes(nameSearch.toLowerCase());
    return matchCountry && matchName;
  });

  const handleAddUniv = (uni) => {
    if (selectedUnivs.length >= MAX_UNIV) {
      alert(`Max ${MAX_UNIV} universities.`);
      return;
    }
    if (selectedUnivs.some((u) => u.name === uni.name && u.country === uni.country)) {
      alert("University already selected.");
      return;
    }
    setSelectedUnivs([...selectedUnivs, uni]);
  };

  const handleRemoveUniv = (uni) => {
    setSelectedUnivs((prev) =>
      prev.filter((u) => !(u.name === uni.name && u.country === uni.country))
    );
  };

  return (
    <DashboardLayout role="student">
      <h2>Apply for a Letter of Recommendation</h2>

      <div className="apply-lor-container">
        <div className="apply-lor-left">
          <h3>LoR Details</h3>
          <form onSubmit={handleSubmitLoR} className="form-lor">
            <label>Campus:</label>
            <select
              name="campus"
              value={selections.campus}
              onChange={handleSelectionChange}
              required
            >
              <option value="">-- Select Campus --</option>
              {campusOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <label>School:</label>
            <select
              name="school"
              value={selections.school}
              onChange={handleSelectionChange}
              required
            >
              <option value="">-- Select School --</option>
              {schoolOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label>Department:</label>
            <select
              name="department"
              value={selections.department}
              onChange={handleSelectionChange}
              required
            >
              <option value="">-- Select Department --</option>
              {departmentOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <label>Specialization:</label>
            <select
              name="specialization"
              value={selections.specialization}
              onChange={handleSelectionChange}
              required
            >
              <option value="">-- Select Specialization --</option>
              {specializationOptions.map((sp) => (
                <option key={sp} value={sp}>{sp}</option>
              ))}
            </select>

            <label>Faculty:</label>
            <select
              name="facultyId"
              value={selections.facultyId}
              onChange={handleSelectionChange}
              required
            >
              <option value="">-- Select Faculty --</option>
              {filteredFaculty.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} (ID: {f.id} - {f.designation || 'No Designation'})
                </option>
              ))}
            </select>

            <label>LOR Content:</label>
            <textarea
              name="lorContent"
              rows={5}
              value={selections.lorContent}
              onChange={handleSelectionChange}
              placeholder="Enter your LOR content..."
              required
            />

            <button type="submit">Submit LOR</button>
          </form>
        </div>

        {/* RIGHT COLUMN: Universities */}
        <div className="apply-lor-right">
          <h3>Universities (Up to {MAX_UNIV})</h3>
          <div className="university-filters">
            <input
              type="text"
              placeholder="Search by Country"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search by Name"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
            />
          </div>

          <div className="universities-list">
            {filteredUnivs.slice(0, 20).map((uni) => (
              <div key={`${uni.name}-${uni.country}`} className="university-item">
                <span>
                  {uni.name} ({uni.country})
                </span>
                <button onClick={() => handleAddUniv(uni)}>Add</button>
              </div>
            ))}
          </div>

          <h4>Selected Universities:</h4>
          {selectedUnivs.length === 0 ? (
            <p>No universities selected.</p>
          ) : (
            <ul>
              {selectedUnivs.map((u) => (
                <li key={`${u.name}-${u.country}`}>
                  {u.name} ({u.country})
                  <button onClick={() => handleRemoveUniv(u)}>Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApplyLoR;
