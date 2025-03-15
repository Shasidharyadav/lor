import React, { useState, useEffect } from 'react';
import Layout from '../Dashboard/Layout';
import DashboardLayout from '../Dashboard/DashboardLayout';
import "../../styles/profile.css";
import { fetchUserProfile, updateUserProfile } from '../../services/api';
import successImg from '../../assets/success_img.png';

const Profile = () => {
  document.title = 'Profile';

  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchUserProfile(); // Fetch the user profile from the API
        setUser(profileData);
        setUpdatedData(profileData); // Prepare data for editing
      } catch (err) {
        console.error('Error loading profile:', err.message);
        setError('Failed to load profile. Please try again later.');
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
      const newErrors = {...errors};

      switch(name) {
        case "name":
          if (!value) {
            newErrors.name = "*This field is required";
          }else if (!value.match(/^[a-zA-Z ]+$/)){
            newErrors.name = "*Only Alphabet and spaces allowed."
          } else{
            delete newErrors.name;
          }
          break;
        case "personalEmail":
          if (user.role === 'student' && !value) {
            newErrors.name = "*This field is required";
          }else if (
            !value.includes("@") ||
            !value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) ||
            value.startsWith(".") ||
            value.endsWith(".") ||
            value.includes("..") || 
            (value.split('@')[1] && value.split('@')[1].split('.').length > 2) ||
            !(["gmail.com", "yahoo.com", "icloud.com", "hotmail.com", "outlook.com"].some(domain => value.includes(`@${domain}`)))
          ) {
            newErrors.personalEmail = "*Invalid email format.";
          } else{
            delete newErrors.personalEmail;
          }
        break;
        case "phone":
          if (user.role === 'teacher'){
            if (!value) {
              newErrors.phone = "*This field is required.";
            } else if (!value.match(/^\d{10}$/)){
              newErrors.phone = "*Should be of only 10 digits.";
            } else {
              delete newErrors.phone;
            }
          }
      }
    setErrors(newErrors);
  };

  const handleUpdate = async () => {
    var newErrors = {};
    const fields = ["name", "personalEmail", "phone"];
    for (let key of fields) {
      if (updatedData.hasOwnProperty(key)) {
        validateField(key, updatedData[key]);
        if (errors[key]) {
          setErrors(errors);
          document.getElementsByName(key)[0].focus();
          return false;
        }
      }
    }

    try {
      setError('');
      setErrors({});
      setSuccess('');

      await updateUserProfile(updatedData); // Call the API to update the user profile
      setUser({ ...user, ...updatedData }); // Update the local state
      setEditMode(false);
      setSuccess('Profile updated successfully!');
      setShowPopup(true); // Show popup
      setTimeout(() => setShowPopup(false), 2000);
    } catch (err) {
      console.error('Error updating profile:', err.message);
      setError('Failed to update profile. Please try again later.');
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="profile">
          <h2>Loading...</h2>
        </div>
      </Layout>
    );
  }

  return (
    <DashboardLayout>
      <div className="profile">
        <h2>Profile</h2>
        {/* Popup Notification */}
        {showPopup && (
          <div className="popup-success">
            <img src={successImg} alt="Success" />
            <span>Profile updated successfully!</span>
          </div>
        )}
        {/* Academic Details */}
        <div className="profile-section">
          <h3>Academic Details</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>User ID</label>
              <input type="text" value={user.id} readOnly />
            </div>
            {user.role !== 'admin' && (
              <>
                <div className="profile-item">
                  <label>Campus</label>
                  <input type="text" value={user.campus || ''} readOnly />
                </div>
                <div className="profile-item">
                  <label>School</label>
                  <input type="text" value={user.school || ''} readOnly />
                </div>
                <div className="profile-item">
                  <label>Department</label>
                  <input type="text" value={user.department || ''} readOnly />
                </div>
              </>
            )}
            {(user.role === 'student' || user.role === 'teacher') && (
              <div className="profile-item">
                <label>Specialization</label>
                <input type="text" value={user.specialization || ''} readOnly />
              </div>
            )}
            {user.role === 'student' && (
              <div className="profile-item">
                <label>Year of Passout</label>
                <input type="text" value={user.yearOfPassout || ''} readOnly />
              </div>
            )}
          </div>
        </div>

        {/* Personal Details */}
        <div className="profile-section">
          <h3>Personal Details</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                value={updatedData.name || ''}
                onChange={handleChange}
                readOnly={!editMode}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>
            <div className="profile-item">
              <label>Gitam Email</label>
              <input type="email" value={user.gitamEmail || ''} readOnly />
            </div>
            {user.role === 'student' && (
            <div className="profile-item">
              <label>Personal Email</label>
              <input
                type="email"
                name="personalEmail"
                value={updatedData.personalEmail || ''}
                onChange={handleChange}
                readOnly={!editMode}
              />
              {errors.personalEmail && <span className="error">{errors.personalEmail}</span>}
            </div>
            )}
            {user.role === 'teacher' && (
              <div className="profile-item">
                <label>Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={updatedData.phone || ''}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Role-Specific Details */}
        {user.role === 'student' && (
          <div className="profile-section">
            <h3>Social Profiles</h3>
            <div className="profile-grid">
              <div className="profile-item">
                <label>LinkedIn</label>
                <input
                  type="text"
                  name="linkedin"
                  value={updatedData.linkedin || ''}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="profile-item">
                <label>Twitter</label>
                <input
                  type="text"
                  name="twitter"
                  value={updatedData.twitter || ''}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="profile-item">
                <label>Portfolio</label>
                <input
                  type="text"
                  name="portfolio"
                  value={updatedData.portfolio || ''}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="profile-item">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={updatedData.bio || ''}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
            </div>
          </div>
        )}

        {user.role === 'teacher' && (
          <div className="profile-section">
            <h3>Faculty Details</h3>
            <div className="profile-grid">
              <div className="profile-item">
                <label>Qualifications</label>
                <textarea
                  name="qualifications"
                  value={updatedData.qualifications || ''}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="profile-item">
                <label>Research Interests</label>
                <textarea
                  name="research_interests"
                  value={updatedData.research_interests || ''}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="profile-item">
                <label>Bio</label>
                <textarea
                  name="bio"
                  value={updatedData.bio || ''}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        {(user.role === 'student' || user.role === 'teacher') && (
        <div className="profile-buttons">
        {error && <div className="error">{error}</div>}
        {/* {success && <div className="success">{success}</div>} */}
          {!editMode ? (
            <button className="edit-button" onClick={() => setEditMode(true)}>
              Edit
            </button>
          ) : (
            <>
              <button className="save-button" onClick={handleUpdate}>
                Save
              </button>
              <button className="cancel-button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </>
          )}
        </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Profile;
