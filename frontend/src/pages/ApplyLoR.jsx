import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import {
  fetchApplyLorMetadata,
  createLorRequest // <-- import the function that does POST /apply-lor
} from '../services/api';
import "../styles/global.css";
import "../styles/ApplyLoR.css";
import successImg from '../assets/success_img.png';
import { useCheckDuplicateForm } from './checkDuplicateForm';

const MAX_UNIV = 7;

const ApplyLoR = () => {
  document.title = 'Apply for LOR';

  const location = useLocation();
  const passedFaculty = location.state?.faculty || null;

  const [teacherList, setTeacherList] = useState([]);

  // Updated: added 'title' and 'deadline' in selections
  const [selections, setSelections] = useState({
    title: "",
    campus: "",
    school: "",
    department: "",
    specialization: "",
    facultyId: "",
    lorContent: "",
    deadline: "" // new
  });

  const [campusOptions, setCampusOptions] = useState([]);
  const [schoolOptions, setSchoolOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [filteredFaculty, setFilteredFaculty] = useState([]);

  const [universities, setUniversities] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]); // New: list of unique countries
  const [selectedCountry, setSelectedCountry] = useState(""); // New: selected country
  const [nameSearch, setNameSearch] = useState("");
  const [selectedUnivs, setSelectedUnivs] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Retrieve the student info from localStorage
  const userData = JSON.parse(localStorage.getItem("user"));
  const studentId = userData?.id; // e.g. "ST123"
  const { checkDuplicate, loading } = useCheckDuplicateForm(selections.facultyId, studentId);

  // 1) Load teacher_users and universities from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchApplyLorMetadata();
        const tList = data.facultyList || [];
        setTeacherList(tList);

        const uniqueCampuses = Array.from(
          new Set(tList.map((t) => t.campus).filter(Boolean))
        ).sort();
        setCampusOptions(uniqueCampuses);

        const uniRes = await fetch("/uni.json");
        const uniData = await uniRes.json();
        setUniversities(uniData);

        // Extract unique countries from universities
        const uniqueCountries = Array.from(
          new Set(uniData.map((uni) => uni.country).filter(Boolean))
        ).sort();
        setCountryOptions(uniqueCountries);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    loadData();
  }, []);

  // 2) Auto-populate if we have passedFaculty
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

  // 3) Cascading dropdown logic
  useEffect(() => {
    if (!selections.campus) {
      setSchoolOptions([]);
      setDepartmentOptions([]);
      setSpecializationOptions([]);
      setFilteredFaculty([]);
      return;
    }
    const campusRows = teacherList.filter((t) => t.campus === selections.campus);
    const uniqueSchools = Array.from(new Set(campusRows.map((t) => t.school).filter(Boolean))).sort();
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
    const uniqueDepts = Array.from(new Set(rows.map((r) => r.department).filter(Boolean))).sort();
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
    const uniqueSpecs = Array.from(new Set(rows.map((r) => r.specialization).filter(Boolean))).sort();
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

  // Updated handleSelectionChange to handle new fields
  const handleSelectionChange = (e) => {
    const { name, value } = e.target;
    // Because changing campus/school/department resets the subsequent fields
    // we do some logic below
    if (name === "campus") {
      setSelections({
        ...selections,
        campus: value,
        school: "",
        department: "",
        specialization: "",
        facultyId: "",
        lorContent: selections.lorContent,
        title: selections.title,
        deadline: selections.deadline
      });
    } else if (name === "school") {
      setSelections({
        ...selections,
        school: value,
        department: "",
        specialization: "",
        facultyId: "",
        lorContent: selections.lorContent,
        title: selections.title,
        deadline: selections.deadline
      });
    } else if (name === "department") {
      setSelections({
        ...selections,
        department: value,
        specialization: "",
        facultyId: "",
        lorContent: selections.lorContent,
        title: selections.title,
        deadline: selections.deadline
      });
    } else if (name === "specialization") {
      setSelections({
        ...selections,
        specialization: value,
        facultyId: "",
        lorContent: selections.lorContent,
        title: selections.title,
        deadline: selections.deadline
      });
    } else {
      // For 'title', 'deadline', 'facultyId', 'lorContent' just set them
      setSelections({
        ...selections,
        [name]: value
      });
    }
  };

  // Handle Country Selection
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);
    setNameSearch(""); // Reset name search when country changes
  };

  // Submit LoR
  const handleSubmitLoR = async (e) => {
    e.preventDefault();
    const { facultyId, lorContent, title, deadline } = selections;

    if (!title) {
      alert("Please select your title (Mr, Ms, etc.).");
      return;
    }

    if (!facultyId) {
      alert("Please select a faculty.");
      return;
    }
    if (!lorContent.trim()) {
      alert("Please provide LOR content.");
      return;
    }
    if (!studentId) {
      alert("Could not find student ID in local storage.");
      return;
    }
    if (!deadline) {
      alert("Please select a deadline.");
      return;
    }
    // At least one university check
    if (selectedUnivs.length === 0) {
      alert("Please select at least one university.");
      return;
    }
    if (checkDuplicate()){
      alert("You can't request the same faculty unless all the previous requests are EXPIRED or FINISHED.");
      return;
    }
    // Build the payload
    const payload = {
      teacher_id: facultyId,
      student_id: studentId,
      campus: selections.campus,
      school: selections.school,
      department: selections.department,
      specialization: selections.specialization,
      lor_content: lorContent,
      universities: selectedUnivs,

      // NEW FIELDS:
      title,
      deadline
    };

    try {
      const response = await createLorRequest(payload);
      // Show success, reset form
      setSelections({
        title: "",
        campus: "",
        school: "",
        department: "",
        specialization: "",
        facultyId: "",
        lorContent: "",
        deadline: ""
      });
      setSelectedUnivs([]);
      setSelectedCountry("");
      setShowPopup(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setShowPopup(false), 2000);
    } catch (error) {
      console.error("Error submitting LoR:", error);
      alert("Failed to submit LoR request. Check console for details.");
    }
  };

  // Filter universities based on selected country and name search
  const filteredUnivs = universities.filter((uni) => {
    if (selectedCountry && uni.country !== selectedCountry) {
      return false;
    }

    // Safely generate abbreviation excluding insignificant words like "of"
    const abbreviation = uni.name
      ?.split(" ") // Split the name into words
      .filter((word) => word && word.toLowerCase() !== "of") // Filter out undefined and "of"
      .map((word) => word[0]?.toUpperCase() || "") // Take the first letter and convert to uppercase
      .join("");

    // Check if name or abbreviation matches the search
    const matchName = uni.name?.toLowerCase().includes(nameSearch.toLowerCase());
    const matchAbbreviation = abbreviation.toLowerCase().includes(nameSearch.toLowerCase());

    return (matchName || matchAbbreviation);
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

  // Helper to compute min date for deadline: 7 days from now
  const getMinDeadline = () => {
    const today = new Date();
    today.setDate(today.getDate() + 7); // add 7 days
    // Format as yyyy-mm-dd for the input
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <DashboardLayout role="student">
      <h2>Apply for a Letter of Recommendation</h2>
      {showPopup && (
        <div className="popup-success">
          <img src={successImg} alt="Success" />
          <span>Request sent successfully!</span>
        </div>
      )}
      <div className="apply-lor-container">
        <div className="apply-lor-left">
          <h3>LoR Details</h3>
          <form onSubmit={handleSubmitLoR} className="form-lor">
            
            {/* Title (Mr, Ms, etc.) */}
            <label>Title:</label>
            <select
              name="title"
              value={selections.title}
              onChange={handleSelectionChange}
              required
            >
              <option value="">-- Select Title --</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
            </select>

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

            {/* Deadline (at least 7 days from now) */}
            <label>Deadline:</label>
            <input
              type="date"
              name="deadline"
              value={selections.deadline}
              onChange={handleSelectionChange}
              min={getMinDeadline()}
              required
            />
            <span className="deadline-hint">
              * The deadline is recommended to be chosen at least 7 days ahead of actual deadline.
            </span>

            <button type="submit">Submit LOR</button>
          </form>
        </div>

        <div className="apply-lor-right">
          <h3>Universities (Up to {MAX_UNIV})</h3>
          <div className="university-filters">
            {/* Country Dropdown */}
            <label>Country:</label>
            <select
              name="country"
              value={selectedCountry}
              onChange={handleCountryChange}
              required
            >
              <option value="">-- Select Country --</option>
              {countryOptions.map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>

            {/* Search by Name or Abbreviation */}
            <input
              type="text"
              placeholder="Search by Name or Abbreviation"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              disabled={!selectedCountry}
            />
          </div>

          {/* Display message if no country is selected */}
          {!selectedCountry && (
            <p className="select-country-message">Please select a country to view universities.</p>
          )}

          {/* Universities List */}
          {selectedCountry && (
            <div className="universities-list">
              {filteredUnivs.length === 0 ? (
                <p>No universities found for the selected criteria.</p>
              ) : (
                filteredUnivs.map((uni) => {
                  // Generate abbreviation, excluding insignificant words like "of"
                  const abbreviation = uni.name
                    .split(" ")
                    .filter((word) => word.toLowerCase() !== "of") // Exclude "of"
                    .map((word) => word[0].toUpperCase()) // Take the first letter of each remaining word
                    .join("");

                  return (
                    <div key={`${uni.name}-${uni.country}`} className="university-item">
                      <span>
                        {uni.name}  - {abbreviation}
                      </span>
                      <button onClick={() => handleAddUniv(uni)}>Add</button>
                    </div>
                  );
                })
              )}
            </div>
          )}

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
