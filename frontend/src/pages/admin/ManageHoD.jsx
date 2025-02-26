import React, {useState} from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import {
  campusOptions,
  campusToSchools,
  allDepartments
} from '../../utilities/filterData'; 

const ManageHoD = () => {
    document.title = 'Manage HoD';
    const user = JSON.parse(localStorage.getItem('user')) || {};

    const [statusSuccess, setStatusSuccess] = useState('');
    const [statusError, setStatusError] = useState('');

  
    const [formAddData, setFormAddData] = useState({
        // Basic fields
        id: '',
        gitamEmail: '',
    });

    const [formDeleteData, setFormDeleteData] = useState({ 
        id: '',
        gitamEmail: '',
    });

    const [createSuccess, setCreateSuccess] = useState('');
    const [createError, setCreateError] = useState('');

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

    const handleAddChange = (e) => {
        const { name, value } = e.target;
        setFormAddData(prev => ({ ...prev, [name]: value }));
    };

    const handleDeleteChange = (e) => {
        const { name, value } = e.target;
        setFormDeleteData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <DashboardLayout role={user.role} user={user}>
            <h2 className='header-container'>Manage Head of Department</h2>
            <div className='admin-form-whole'>
        
                <div className='admin-form'>
                    <h3>Assign Head Of Department</h3>
                    {createError && <p className="error-message">{createError}</p>}
                    {createSuccess && <p style={{ color: 'green' }}>{createSuccess}</p>}

                    <label className='labels'>Employee ID</label>
                        <input
                        className="credentials"
                        type="text"
                        name="id"
                        value={formAddData.id}
                        onChange={handleAddChange}
                        placeholder='Enter Employee ID'
                    />

                    {user.role === 'admin' && (
                      <>
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
                      </>
                    )}

                <button
                    type="submit"
                    className='submit-btn'
                    style={{marginTop: '30px', padding: '15px 25px', minWidth: '100%'}}
                >
                    Assign HoD
                </button>
            </div>
        {/* ==================== CARD 2: DELETE DEPARTMENTAL ADMIN ===================== */}
        <div className='admin-form'>
          <h3>De-Assign Head Of Department</h3>
              <label className='labels'>Employee ID</label>
              <input
                className="credentials"
                type="text"
                name="id"
                value={formDeleteData.id}
                onChange={handleDeleteChange}
                placeholder='Enter Employee ID'
              />

            <button
              type="submit"
              className='submit-btn delete'
              style={{marginTop: '30px', padding: '15px 25px', minWidth: '100%'}}
            >
              De-Assign HoD
            </button>
          </div>
      </div>
        </DashboardLayout>
    )
}

export default ManageHoD;