// src/pages/Admin/ManageUsersPage.jsx
import React, { useState } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import {
  createDepartmentAdmin,
  updateTeacherStatus
} from '../../services/api';

import {
  campusOptions,
  campusToSchools,
  allDepartments
} from '../../utilities/filterData'; 
import successImg from '../../assets/success_img.png';
import failureImg from '../../assets/failure_img.png';

import '../../styles/global.css';

const ManageDeptAdmins = () => {
  document.title = "Manage Admins";
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showFailurePopup, setShowFailurePopup] = useState(false);
  
  const [formAddData, setFormAddData] = useState({
    // Hard-coded role for departmental admin
    role: 'department_admin',
    // Basic fields
    id: '',
    name: '',
    gitamEmail: '',
    password: '',
    // For departmental admin
    campus: '',
    school: '',
    department: ''
  });

  const [formDeleteData, setFormDeleteData] = useState({ 
    role: 'department_admin',
    id: '',
  });

  const [createSuccess, setCreateSuccess] = useState('');
  const [createError, setCreateError] = useState('');


  const handleAddChange = (e) => {
    const { name, value } = e.target;
    setFormAddData(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteChange = (e) => {
    const { name, value } = e.target;
    setFormDeleteData(prev => ({ ...prev, [name]: value }));
  };

  // For campus, we reset school and department
  const handleAddCampusChange = (e) => {
    setFormAddData(prev => ({
      ...prev,
      campus: e.target.value,
      school: '',
      department: ''
    }));
  };

  // For school, we reset department
  const handleAddSchoolChange = (e) => {
    setFormAddData(prev => ({
      ...prev,
      school: e.target.value,
      department: ''
    }));
  };

  const handleAddDepartmentChange = (e) => {
    setFormAddData(prev => ({
      ...prev,
      department: e.target.value
    }));
  };


  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreateSuccess('');

    try {
      const response = await createDepartmentAdmin(formAddData);
      setCreateSuccess(`Departmental Admin created successfully!`);
      const data = await response.json();

    if (!response.ok) {
      // setCreateError(data.message);
      throw new Error(data.message);
    }
      // Reset the form
      setFormAddData({
        role: 'department_admin',
        id: '',
        name: '',
        gitamEmail: '',
        password: '',
        campus: '',
        school: '',
        department: ''
      });
      setShowSuccessPopup(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setShowSuccessPopup(false), 2000);
    } catch (err) {
      setCreateError(err.message || 'Failed to create departmental admin.');
      setShowFailurePopup(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setShowFailurePopup(false), 2000);
    }
  };

  return (
    <DashboardLayout role={user.role} user={user}>
      <h2 className='header-container'>Add/Delete Departmental Admins</h2>
      <div className='admin-form-whole'>
        
      <div className='admin-form'>
          <h3>Create Departmental Admin</h3>
          {/* {createError && <p className="error-message">{createError}</p>} */}
          {/* {createSuccess && <p style={{ color: 'green' }}>{createSuccess}</p>} */}

              <label className='labels'>Employee ID</label>
              <input
                className="credentials"
                type="text"
                name="id"
                value={formAddData.id}
                onChange={handleAddChange}
                placeholder='Enter Employee ID'
              />

            {/* NAME */}
              <label className='labels'>Full Name</label>
              <input
                className="credentials"
                type="text"
                name="name"
                value={formAddData.name}
                onChange={handleAddChange}
                placeholder='Enter Full Name'
              />

            {/* GITAM EMAIL */}
              <label className='labels'>Email ID</label>
              <input
                className="credentials"
                type="email"
                name="gitamEmail"
                value={formAddData.gitamEmail}
                onChange={handleAddChange}
                placeholder='Enter GITAM Email ID'
              />

            {/* PASSWORD */}
              <label className='labels'>Password</label>
              <input
                className="credentials"
                type="password"
                name="password"
                value={formAddData.password}
                onChange={handleAddChange}
                placeholder='Enter Password'
              />

            {/* CAMPUS */}
              <label className='labels'>Campus</label>
              <select
                className="credentials"
                name="campus"
                value={formAddData.campus}
                onChange={handleAddCampusChange}
              >
                <option value="">--Select Campus--</option>
                {campusOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

            {/* SCHOOL */}
              <label className='labels'>School</label>
              <select
                className="credentials"
                name="school"
                value={formAddData.school}
                onChange={handleAddSchoolChange}
                disabled={!formAddData.campus}
              >
                <option value="">--Select School--</option>
                {formAddData.campus &&
                  campusToSchools[formAddData.campus]?.map((sch) => (
                    <option key={sch} value={sch}>{sch}</option>
                  ))}
              </select>

            {/* DEPARTMENT */}
              <label className='labels'>Department</label>
              <select
                className="credentials"
                name="department"
                value={formAddData.department}
                onChange={handleAddDepartmentChange}
                disabled={!formAddData.school}
              >
                <option value="">--Select Department--</option>
                {formAddData.school &&
                  allDepartments[formAddData.school]?.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
              </select>

            <button
              type="submit"
              className='submit-btn'
              onClick={handleCreateAdmin}
              style={{marginTop: '30px', padding: '15px 25px', minWidth: '100%'}}
            >
              Create Departmental Admin
            </button>
          </div>
        {/* ==================== CARD 2: DELETE DEPARTMENTAL ADMIN ===================== */}
        <div className='admin-form'>
          <h3>Delete Departmental Admin</h3>
              <label className='labels'>Employee ID</label>
              <input
                className="credentials"
                type="text"
                name="id"
                value={formDeleteData.id}
                onChange={handleDeleteChange}
                placeholder='Enter Employee ID'
              />

            {/* CAMPUS */}
              {/* <label className='labels'>Campus</label>
              <select
                className="credentials"
                name="campus"
                value={formDeleteData.campus}
                onChange={handleDeleteCampusChange}
              >
                <option value="">--Select Campus--</option>
                {campusOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select> */}

            {/* SCHOOL */}
              {/* <label className='labels'>School</label>
              <select
                className="credentials"
                name="school"
                value={formDeleteData.school}
                onChange={handleDeleteSchoolChange}
                disabled={!formDeleteData.campus}
              >
                <option value="">--Select School--</option>
                {formDeleteData.campus &&
                  campusToSchools[formDeleteData.campus]?.map((sch) => (
                    <option key={sch} value={sch}>{sch}</option>
                  ))}
              </select> */}

            {/* DEPARTMENT */}
              {/* <label className='labels'>Department</label>
              <select
                className="credentials"
                name="department"
                value={formDeleteData.department}
                onChange={handleDeleteDepartmentChange}
                disabled={!formDeleteData.school}
              >
                <option value="">--Select Department--</option>
                {formDeleteData.school &&
                  allDepartments[formDeleteData.school]?.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
              </select> */}

            <button
              type="submit"
              className='submit-btn delete'
              style={{marginTop: '30px', padding: '15px 25px', minWidth: '100%'}}
            >
              Delete Departmental Admin
            </button>
          </div>
      </div>
      {showSuccessPopup && (
              <div className="popup-success">
                <img src={successImg} alt="Success" />
                <span>{createSuccess}</span>
              </div>
      )}
      {showFailurePopup && (
              <div className="popup-success">
                <img src={failureImg} alt="Failure" />
                <span style={{color: 'darkred'}}>{createError}</span>
              </div>
      )}
    </DashboardLayout>
  );
};

export default ManageDeptAdmins;
