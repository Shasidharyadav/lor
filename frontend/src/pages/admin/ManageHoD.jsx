import React, {useState, useEffect, useRef} from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { updateTeacherStatus } from '../../services/api';
import {
  campusOptions,
  campusToSchools,
  allDepartments
} from '../../utilities/filterData'; 
import successImg from '../../assets/success_img.png';

const ManageHoD = () => {
    document.title = 'Manage HoD';
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const addRef = useRef(null);
  
    const [formData, setFormData] = useState({
        // Basic fields
        id: '',
        gitamEmail: '',
        campus: '',
        school: '',
        department: '',
        specialization: '',
        status: '',
    });

     // For campus, we reset school and department
  const handleCampusChange = (e) => {
    setFormData(prev => ({
      ...prev,
      campus: e.target.value,
      school: '',
      department: ''
    }));
  };

  // For school, we reset department
  const handleSchoolChange = (e) => {
    setFormData(prev => ({
      ...prev,
      school: e.target.value,
      department: ''
    }));
  };

  const handleDepartmentChange = (e) => {
    setFormData(prev => ({
      ...prev,
      department: e.target.value,
      specialization: ''
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (addRef.current && !addRef.current.contains(event.target)) {
        setConfirmSubmit(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateID = (value) => {
    if (value && !value.match(/^[a-zA-Z0-9]+$/)) {
      return false;
    }
      return true;
  };

  const handleSubmit = () => {
    if (formData.id === '') {
        setError('Please fill all the fields');
        return;
    }
    if (!validateID(formData.id)) {
        setError('Invalid Employee ID');
        return;
    }
    if (formData.campus === '') {
        setError('Please select a campus');
        return;
    }
    if (formData.status === '') {
        setError('Please select a status');
        return;
    }
    
    setError('');
    setConfirmSubmit(true);
    }

    const handleSubmitHoD = async () => {
      try {
        await updateTeacherStatus(formData.id, formData.status);
        setSuccess(`${formData.id} status updated to ${formData.status} successfully!`);
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);
      } catch(err) {
        console.error(err);
        setError('Failed to update');
      } finally {
        setConfirmSubmit(false);
      }
    }

    return (
        <DashboardLayout role={user.role} user={user}>
            {/* Popup Notification */}
            {showPopup && (
              <div className="popup-success">
                <img src={successImg} alt="Success" />
                <span>{success}</span>
              </div>
            )}
            <h2 className='header-container'>Manage Head of Department</h2>
            <div className='heads-form-whole'>
              <div className='heads-form'>
                {error && <p className="error-message">{error}</p>}
                <label className='labels'>Employee ID</label>
                <input
                  className="credentials"
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  placeholder='Enter Employee ID'
                />

                {user.role === 'admin' && (
                <>
                  {/* CAMPUS */}
                  <label className='labels'>Campus</label>
                  <select
                    className="credentials"
                    name="campus"
                    value={formData.campus}
                    onChange={handleCampusChange}
                  >
                    <option value="" disabled>Select Campus</option>
                    {campusOptions.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>                        

                  {/* SCHOOL */}
                  <label className='labels'>School</label>
                  <select
                    className="credentials"
                    name="school"
                    value={formData.school}
                    onChange={handleSchoolChange}
                    disabled={!formData.campus}
                  >
                    <option value="" disabled>Select School</option>
                    {formData.campus &&
                      campusToSchools[formData.campus]?.map((sch) => (
                      <option key={sch} value={sch}>{sch}</option>
                    ))}
                  </select>                        
                                    
                  {/* DEPARTMENT */}
                  <label className='labels'>Department</label>
                  <select
                    className="credentials"
                    name="department"
                    value={formData.department}
                    onChange={handleDepartmentChange}
                    disabled={!formData.school}
                  >
                    <option value="" disabled>Select Department</option>
                    {formData.school &&
                    allDepartments[formData.school]?.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>

                  {formData.department === 'Department of Computer Science & Engineering' && (
                    <>
                      <label className='labels'>Specialization</label>
                      <select
                        className="credentials"
                        name="specialization"
                        value={formData.specialization || ''}
                        onChange={handleInputChange}
                      >
                        <option value="" disabled>Select Specialization</option>
                        <option value="General">General</option>
                        <option value="Specialization">Specialization</option>
                      </select>
                    </>
                  )}
                </>
                )}

                <label className='labels'>Status<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                  <select 
                    className="credentials"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled>Select Status</option>
                    <option value="teacher">Faculty</option>
                    <option value="HOD">HoD</option>
                  </select>

                <button
                  type="submit"
                  className='submit-btn'
                  style={{marginTop: '30px', padding: '15px 25px', minWidth: '100%'}}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
            </div>
          </div>
          {confirmSubmit && (
            <div className="confirm-delete" ref={addRef}>
              <p>Are you sure you want to update the status of {formData.id} as {formData.status === 'teacher' ? 'Faculty' : 'HoD'}?</p>
              <div className='confirm-delete-buttons'>
                <button onClick={() => setConfirmSubmit(false)} className='buttons cancel'>No, Cancel</button>
                <button className='buttons delete' style={{backgroundColor:'var(--primary-color)'}} onClick={handleSubmitHoD}>YES,Submit Request</button>
              </div>
            </div>
          )}
        </DashboardLayout>
    )
}

export default ManageHoD;