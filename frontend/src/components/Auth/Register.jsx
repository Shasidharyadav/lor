import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/api'; // API service
import "../../styles/global.css";
import "../../styles/auth.css";
import logo from "../../assets/gitam_green_logo.png";
import successImg from '../../assets/success_img.png';

const Register = () => {
  document.title = 'Register';

  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({id: "",
    gitamEmail: "",
    name: "",
    personalEmail: "",
    campus: "",
    school: "",
    department: "",
    specialization: "",
    yearOfPassout: "",
    password: "",
    confirmPassword: "",}); // Form data state
  const [errors, setErrors] = useState({}); // Validation errors
  const [schools, setSchools] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [success, setSuccess] = useState(''); // Success message
  const navigate = useNavigate();
  const clearErrors = {
    id: "",
    gitamEmail: "",
    name: "",
    personalEmail: "",
    phone: "",
    campus: "",
    school: "",
    department: "",
    specialization: "",
    yearOfPassout: "",
    designation: "",
    password: "",
    confirmPassword: "",
  };
  const [showPopup, setShowPopup] = useState(false);

  const [passwordRules, setPasswordRules] = useState({
    length: false,
    alphabet: false,
    spaces: false,
    number: false,
    specialCharNumber: false,
    matchConfirm: false,
  });

  const allSchools = {
    'Vishakhapatnam': [
      "School of Architecture",
      "School of Business",
      "School of Humanities & Social Sciences",
      "School of Law",
      "School of Pharmacy",
      "School of Science",
      "School of Technology"
    ],
    'Hyderabad': [
      "School of Architecture",
      "School of Business",
      "School of Humanities & Social Sciences",
      "School of Pharmacy",
      "School of Science",
      "School of Technology"
    ],
    'Bengaluru': [
      "School of Business",
      "School of Humanities & Social Sciences",
      "School of Science",
      "School of Technology"
    ]
  };

  const allDepartments = {
    "School of Architecture": [
      "Architecture",
    ], 
    "School of Business": [
      "Business Administration",
      "Management Studies",
    ],
    "School of Humanities & Social Sciences": [
      "English",
      "Economics",
      "Fine Arts",
      "History",
      "Media Studies and Visual Communication",
      "Political Science",
      "Psychology",
      "Sociology",
    ], 
    "School of Law": [
      "Labor and Industrial Law", 
      "Corporate Law",
    ], 
    "School of Pharmacy": [
      "Pharmaceutical Chemistry",
      "Biotechnology",
    ], 
    "School of Science": [
      "Physics",
      "Food Science and Technology",
      "Mathematics",
      "Chemistry",
    ], 
    "School of Technology": [
      "Aerospace Engineering", 
      "Civil Engineering", 
      "Computer Science & Engineering", 
      "Electrical, Electronics & Communication Engineering", 
      "Mechanical Engineering"
    ]
  };

  const allSpecializations = {
    "Physics": [
      "General",
    ],
    "Food Science and Technology": [
      "General",
    ],
    "Mathematics": [
      "General",
    ],
    "Chemistry": [
      "General",
    ],
    "Pharmaceutical Chemistry": [
      "General",
    ],
    "Biotechnology": [
      "General",
    ],
    "Labor and Industrial Law": [
      "General",
    ], 
    "Corporate Law": [
      "General",
    ],
    "English": [
      "General",
    ],
    "Economics": [
      "General",
    ],
    "Fine Arts": [
      "General",
    ],
    "History": [
      "General",
    ],
    "Media Studies and Visual Communication": [
      "General",
    ],
    "Political Science": [
      "General",
    ],
    "Psychology": [
      "General",
    ],
    "Sociology": [
      "General",
    ],
    "Architecture": [
      "General",
    ],
    "Management Studies": [
      "Operations Management",
      "Entrepreneurship",
    ],
    "Business Administration": [
      "General",
      "Financial Markets", 
      "Marketing", 
      "Human Resource Management",
      "Business Analytics"
    ],
    "Aerospace Engineering": [
      "General"
    ],
    "Civil Engineering": [
      "General",
      "Artificial Intelligence and Machine Learning",
      "Construction Administration",
    ],
    "Computer Science & Engineering": [
      "General", 
      "Artificial Intelligence and Machine Learning", 
      "Cyber Security", 
      "Data Science", "Internet of Things", 
      "Computer Science and Business Systems"
    ],
    "Electrical, Electronics & Communication Engineering": [
      "General",
      "Artificial Intelligence and Machine Learning",
      "Internet of Things",
      "VLSI Design",
      "VLSI IT", 
    ],
    "Mechanical Engineering": [
      "Artificial Intelligence and Machine Learning",
      "General", 
      "Robotics and Artificial Intelligence",
    ]
  };

  const teacherSpecializations = [ "General", "Specialization"];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2015 + 2 }, (_, index) => 2015 + index);
  const campus = ["Vishakhapatnam", "Hyderabad", "Bengaluru"];


//VALIDATIONS
const validateID = (value) => {
  if (value && !value.match(/^[a-zA-Z0-9]+$/)) {
    return false;
  }
  return true;
};

const validategitamEmail = (value) => {
  if (
    !value.includes("@") ||
    !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
    value.startsWith(".") ||
    value.endsWith(".") ||
    value.includes("..") ||
    (role === 'teacher' && !value.endsWith("@gitam.edu")) ||
    (role === 'student' &&
      !value.match(/@(gitam\.edu|gitam\.in|GITAM\.EDU|GITAM\.IN)$/))
  ) {
    return false;
  }
  return true;
};

const validatePersonalEmail = (value) => {
  if (
    !value.includes("@") ||
    !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
    value.startsWith(".") ||
    value.endsWith(".") ||
    value.includes("..") || (value.split('@')[1] && value.split('@')[1].split('.').length > 2)
  ) {
    return false;
  }
  return true;
};

const validateName = (value) => {
  if (!value.match(/^[a-zA-Z ]+$/)) {
    return false;
  }
  return true;
};

// Validate password rules
const validatePassword = (value) => {
  setPasswordRules({
    length: value.length >= 8,
    alphabet: /[A-Za-z]/.test(value),
    consecutiveSpaces: value && !(/\s\s\s/.test(value)),
    extremeSpaces: value && !(value.startsWith(" ") || value.endsWith(" ")),
    specialCharNumber: /[0-9@#$%^&*(),.?":{}|<>]/.test(value),
    matchConfirm: value && value === formData.confirmPassword,
  });
  return Object.values(passwordRules).every(Boolean);
};

const validateConfirmPassword = (value) => {
  setPasswordRules({
    matchConfirm: value && value === formData.password,
  });
  return Object.values(passwordRules).every(Boolean);
};

const validateField = (name, value) => {
  const newErrors = { ...errors };

  switch (name) {
    case "id":
      if (!value) {
        newErrors.id = "*This field is required.";
      } else if (!validateID(value)) {
        newErrors.id = "*Only alphanumerics are allowed";
      } else {
        delete newErrors.id;
      }
      break;
    case "gitamEmail":
      if (!value) {
        newErrors.gitamEmail = "*This field is required.";
      } else if (!validategitamEmail(value)) {
        newErrors.gitamEmail = "*Invalid Email format.";
      } else {
        delete newErrors.gitamEmail;
      }
      break;
    case "name":
      if (!value) {
        newErrors.name = "*This field is required.";
      } else if (!validateName(value)) {
        newErrors.name = "*Only alphabets and spaces allowed.";
      } else {
        delete newErrors.name;
      }
      break;
    case "personalEmail":
      if (role === 'student' && !value) {
        newErrors.personalEmail = "*This field is required.";
      } else if (role === 'student' && !validatePersonalEmail(value)) {
        newErrors.personalEmail = "*Invalid Email format.";
      } else if (role === 'student' && value.match(/@(gitam\.edu|gitam\.in|GITAM\.EDU|GITAM\.IN)$/)){
        newErrors.personalEmail = "*Personal Email should not be Gitam Email.";
      } else {
        delete newErrors.personalEmail;
      }
      break;
    case "phone":
      if (role === 'teacher' && value && !value.match(/^\d+$/)) {
        newErrors.phone = "*Should be only digits.";
      } else {
        delete newErrors.phone;
      }
      break;
    case "campus":
      if (!value || value.match(/Select Campus$/)) {
        newErrors.campus = "*Please select your campus.";
      } else {
        delete newErrors.campus;
      }
      break;
    case "school":
      if (!value || value.match(/Select School$/)) {
        newErrors.school = "*Please select your school.";
      }
      else {
        delete newErrors.school;
      }
      break;
    case "department":
      if (!value || value.match(/Select Department$/)) {
        newErrors.department = "*Please select your department.";
      } else {
        delete newErrors.department;
      }
      break;
    case "specialization":
      if (!value || value.match(/Select Specialization$/)) {
        newErrors.specialization = "*Please select your specialization.";
      } else {
        delete newErrors.specialization;
      }
      break;
    case "designation":
      if (role === 'teacher' && (!value || value.match(/Select Designation$/))) {
        newErrors.designation = "*Please select your designation.";
      } else {
        delete newErrors.designation;
      }
      break;
    case "yearOfPassout":
      if (role === 'student' && (!value || value.match(/Select Year$/))) {
        newErrors.yearOfPassout = "*Please select your year of passout.";
      } else {
        delete newErrors.yearOfPassout;
      }
      break;
    case "password":
      if (!value) {
        newErrors.password = "*This field is required.";
      } else if (/\s\s\s/.test(value) || value.startsWith(" ") || value.endsWith(" ") || !/[A-Za-z]/.test(value) || !/[!@#$%^&*(),.?":{}|<>]/.test(value) || !/\d/.test(value) || value.length < 8) {
        newErrors.password =
          "*Invalid Passoword";
      } else {
        delete newErrors.password;
      }
      break;
    case "confirmPassword":
      if (!value) {
        newErrors.confirmPassword = "*This field is required.";
      } else if (formData.password != value) {
        newErrors.confirmPassword = "*Confirm Password must match Password.";
      } else {
        delete newErrors.confirmPassword;
      }
      break;
    default:
      break;
  }
  setErrors(newErrors);
  return newErrors;
};

const handleInputOnChange = (e) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({ ...prevData, [name]: value }));
  // console.log("Entered onchange", name, value);
  const newErrors = {...errors};
  if (name === 'campus') {
    setSchools(allSchools[value] || []);
  }
  if (name === 'school') {
    setDepartments(allDepartments[value] || []);
  }
  if (name === 'department') {
    if (role === 'student')  setSpecializations(allSpecializations[value] || []);
    else setSpecializations(teacherSpecializations || []);
  }
  if (value === ''){
    console.log(name, value);
    delete newErrors[name];
    setErrors(newErrors);
    return;
  }
  if (!(name === 'gitamEmail') && 
    !(name === 'personalEmail') &&
    !(name === 'campus') &&
    !(name === 'designation') &&
    !(name === 'department') &&
    !(name === 'yearOfPassout') &&
    !(name === 'specialization') && 
    !(name === 'school') &&
    value
  ){
    // console.log(name, value, "validating field");
    validateField(name, value);
  }
};


const handleInputOnBlur = (e) => {
  const { name, value } = e.target;
  if (value) validateField(name, value);
}

  // Form validation logic
  const validateForm = () => {
    var newErrors = {};
    setErrors(clearErrors);
    for (let [key, value] of Object.entries(formData)) {
      newErrors = validateField(key, value);
      console.log(newErrors);
      if (newErrors[key]) {
        break;
      }
    }
    setErrors(newErrors);

    for (let key of Object.keys(formData)){
      if (newErrors[key]){
        document.getElementsByName(key)[0].focus();
        console.log(key);
        return false;
      }
    }

    return true;
  };
  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
        try {
            // Send data to the backend via API
            const response = await registerUser({ ...formData, role });
            setSuccess(response.message || 'Registration successful! You can now log in.');

            // Reset form and navigate to the login page
            setFormData({});
            setRole('student'); // Reset role selection
            setErrors({});
            setShowPopup(true); // Show popup
            setTimeout(() => setShowPopup(false), 1000);
            window.scrollTo({ top: 0, behavior: "smooth" });
            setTimeout(() => {
              // window.location.reload();
              navigate('/login');
            }, 1000);
        } catch (err) {
            setErrors({ general: err.response?.data?.message || 'Something went wrong. Please try again.' });
        }
    }
};



  return (
    <div className="form-container">
      {/* Popup Notification */}
      {showPopup && (
        <div className="popup-success">
          <img src={successImg} alt="Success" />
          <span>Registered successfully!</span>
          <span>You can login now!</span>
        </div>
      )}
      <img src={logo} className="gitamLogo" alt="Gitam Logo" />
      {success && <span className="success">{success}</span>}
      <div className="toggle-role">
                  <button
                    type="button"
                    className={role === 'student' ? "active" : ""}
                    onClick={() => {
                      if (role === 'teacher') {
                        setRole('student');
                        setFormData({
                          id: "",
                          gitamEmail: "",
                          personalEmail: "",
                          name: "",
                          campus: "",
                          school: "",
                          department: "",
                          specialization: "",
                          yearOfPassout: "",
                          password: "",
                          confirmPassword: "",
                        });
                        setSchools([]);
                        setDepartments([]);
                        setSpecializations([]);
                        setErrors(clearErrors);
                        setPasswordRules({
                          length: false,
                          alphabet: false,
                          spaces: false,
                          number: false,
                          specialCharNumber: false,
                        });
                      }
                    }}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    className={role === 'teacher' ? "active" : ""}
                    onClick={() => {
                      if (role === 'student') {
                        setRole('teacher');
                        setFormData({
                          id: "",
                          gitamEmail: "",
                          name: "",
                          phone: "",
                          campus: "",
                          school: "",
                          department: "",
                          specialization: "",
                          designation: "",
                          password: "",
                          confirmPassword: "",
                        });
                        setSchools([]);
                        setDepartments([]);
                        setSpecializations([]);
                        setErrors(clearErrors);
                        setPasswordRules({
                          length: false,
                          alphabet: false,
                          spaces: false,
                          number: false,
                          specialCharNumber: false,
                        });
                      }
                    }}
                  >
                    Faculty
                  </button>
                </div>
      <div className="form-container register">
      <div className='id'>
                <label className="labels required">
                  {role === 'teacher' ? "Faculty ID" : "Student ID"}
                </label>
                <input
                  className="credentials"
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputOnChange}
                  placeholder="User ID"
                  maxLength={16}
                />
                {errors.id && <span className="error">{errors.id}</span>}
              </div>
      <div className='form-panels'>
              <div className="form-panel left-panel">
      
                <label className="labels required">GITAM Email ID</label>
                <input
                  className="credentials"
                  type="email"
                  name="gitamEmail"
                  value={formData.gitamEmail}
                  onChange={handleInputOnChange}
                  onBlur={handleInputOnBlur}
                  placeholder="GITAM Email ID"
                />
                {errors.gitamEmail && <span className="error">{errors.gitamEmail}</span>}
      
                <label className="labels required">Full Name</label>
                <input
                  className="credentials"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputOnChange}
                  placeholder="Full Name"
                />
                {errors.name && (
                  <span className="error">{errors.name}</span>
                )}
                {role === 'teacher' ? (
                  <>
                <label className="labels">Phone Number(+91)</label>
                <input
                  className="credentials"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputOnChange}
                  placeholder="XXX-XXX-XXXX"
                  maxLength={10}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
                </>
                ) : (
                  <>
                  <label className="labels required">Personal Email ID</label>
                <input
                  className="credentials"
                  type="email"
                  name="personalEmail"
                  value={formData.personalEmail}
                  onChange={handleInputOnChange}
                  onBlur={handleInputOnBlur}
                  placeholder="Personal Email ID"
                />
                {errors.personalEmail && <span className="error">{errors.personalEmail}</span>}
                  </>
                )}

                <label className="labels required">Campus</label>
                <select
                  className="credentials"
                  name="campus"
                  value={formData.campus}
                  onChange={handleInputOnChange}
                >
                  <option value="" disabled>Select Campus</option>
                  {campus.map((camp) => (
                    <option key={camp} value={camp}>
                      {camp}
                    </option>
                  ))}
                </select>
                {errors.campus && <span className="error">{errors.campus}</span>}
                <label className="labels required">School</label>
            <select
              className="credentials"
              name="school"
              value={formData.school}
              onChange={handleInputOnChange}
              disabled={!formData.campus}
            >
              <option value="" disabled>Select School</option>
                {schools.map((school) => (
                  <option key={school} value={school}>
                    {school}
                  </option>
                ))}
            </select>
            {errors.school && <span className="error">{errors.school}</span>}
            <label className="labels required">Department</label>
                <select
                  className="credentials"
                  name="department"
                  value={formData.department}
                  onChange={handleInputOnChange}
                  disabled={!formData.school}
                >
                  <option value="" disabled>Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <span className="error">{errors.department}</span>
                )}
            </div>
    
            <div className="form-panel right-panel">
            
                <label className="labels required">Specialization</label>
                <select
                  className="credentials"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputOnChange}
                  disabled={!formData.department}
                >
                  <option value="" disabled>Select Specialization</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
                {errors.specialization && (
                  <span className="error">{errors.specialization}</span>
                )}

                {role === 'teacher' ? (
                  <>
                    <label className="labels required">Designation</label>
                    <select
                      className="credentials"
                      name="designation"
                      value={formData.designation}
                      onChange={handleInputOnChange}
                    >
                      <option value="">Select Designation</option>
                      <option>Assistant Professor</option>
                      <option>Associate Professor</option>
                      <option>Professor</option>
                    </select>
                    {errors.designation && (
                      <span className="error">{errors.designation}</span>
                    )}
                  </>
                ) : (
                  <>
                    <label className="labels required">Year of Passout</label>
                    <select
                      className="credentials"
                      name="yearOfPassout"
                      value={formData.yearOfPassout}
                      onChange={handleInputOnChange}
                    >
                      <option value="" disabled>Select Year</option>
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    {errors.yearOfPassout && (
                      <span className="error">{errors.yearOfPassout}</span>
                    )}
                  </>
                )}
      
                <label className="labels required">Password</label>
                <input
                  className="credentials"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => {
                    handleInputOnChange(e);
                    validatePassword(e.target.value);
                  }}
                  placeholder="Password"
                  maxLength={16}
                />
                {/* {errors.password && <span className="error">{errors.password}</span>} */}
      <div className="password-rules-auth">
        <div>
          <input
          className='auth-checkbox'
            type="checkbox"
            checked={passwordRules.length}
            tabIndex="-1"
            readOnly
          />{" "}
          At least 8 characters
        </div>
        <div>
          <input
            className='auth-checkbox'
            type="checkbox"
            checked={passwordRules.alphabet}
            tabIndex="-1"
            readOnly
          />{" "}
          At least 1 alphabet
        </div>
        <div>
          <input
            className='auth-checkbox'
            type="checkbox"
            checked={passwordRules.consecutiveSpaces}
            tabIndex="-1"
            readOnly
          />{" "}
          At most 2 consecutive spaces
        </div>
        <div>
          <input
            className='auth-checkbox'
            type="checkbox"
            checked={passwordRules.extremeSpaces}
            tabIndex="-1"
            readOnly
          />{" "}
          No leading/trailing spaces
        </div>
        <div>
          <input
            className='auth-checkbox'
            type="checkbox"
            checked={passwordRules.specialCharNumber}
            tabIndex="-1"
            readOnly
          />{" "}
          At least 1 special character and 1 digit
        </div>
      </div>
                <label className="labels required">Confirm Password</label>
                <input
                  className="credentials"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    handleInputOnChange(e);
                    validateConfirmPassword(e.target.value);
                  }}
                  placeholder="Confirm Password"
                  maxLength={16}
                />
              <div className='password-rules-auth'>
          <input
            className='auth-checkbox'
            type="checkbox"
            checked={passwordRules.matchConfirm}
            tabIndex="-1"
            readOnly
          />{" "}
          Passwords are matching
        </div>
              </div>
      </div>
      </div>
      <button type="submit" className="submit-btn" onClick={handleSubmit}>
              Register
      </button>

      <div className="auth-navigation">
        <p>
          Already registered?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
        {errors.general && <span className="error">{errors.general}</span>}
      </div>
    </div>
  );
};

export default Register;
