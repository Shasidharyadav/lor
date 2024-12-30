import React, { useState, useEffect } from 'react';
import Layout from '../Dashboard/Layout';
import "../../styles/profile.css";
import { fetchUserProfile, updateUserProfile } from '../../services/api';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
  };

  const handleUpdate = async () => {
    try {
      setError('');
      setSuccess('');

      await updateUserProfile(updatedData); // Call the API to update the user profile
      setUser({ ...user, ...updatedData }); // Update the local state
      setEditMode(false);
      setSuccess('Profile updated successfully!');
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
    <Layout>
      <div className="profile">
        <h2>Profile</h2>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        {/* Academic Details */}
        <div className="profile-section">
          <h3>Academic Details</h3>
          <div className="profile-grid">
            <div className="profile-item">
              <label>Registration ID</label>
              <input type="text" value={user.id} readOnly />
            </div>
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
            <div className="profile-item">
              <label>Specialization</label>
              <input type="text" value={user.specialization || ''} readOnly />
            </div>
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
            </div>
            <div className="profile-item">
              <label>Gitam Email</label>
              <input type="email" value={user.gitamEmail || ''} readOnly />
            </div>
            <div className="profile-item">
              <label>Personal Email</label>
              <input
                type="email"
                name="personalEmail"
                value={updatedData.personalEmail || ''}
                onChange={handleChange}
                readOnly={!editMode}
              />
            </div>
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

        {user.role === 'admin' && (
          <div className="profile-section">
            <h3>Admin Details</h3>
            <div className="profile-grid">
              <div className="profile-item">
                <label>School</label>
                <input
                  type="text"
                  name="school"
                  value={updatedData.school || ''}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
              <div className="profile-item">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  value={updatedData.department || ''}
                  onChange={handleChange}
                  readOnly={!editMode}
                />
              </div>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="profile-buttons">
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
      </div>
    </Layout>
  );
};

export default Profile;
