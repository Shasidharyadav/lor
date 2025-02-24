import React, {useState} from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';


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
          <h3>Delete Head Of Department</h3>
              <label className='labels'>Employee ID</label>
              <input
                className="credentials"
                type="text"
                name="id"
                value={formDeleteData.id}
                onChange={handleDeleteChange}
                placeholder='Enter Employee ID'
              />

            {/* GITAM EMAIL */}
              <label className='labels'>Email ID</label>
              <input
                className="credentials"
                type="email"
                name="gitamEmail"
                value={formDeleteData.gitamEmail}
                onChange={handleDeleteChange}
                placeholder='Enter GITAM Email ID'
              />

            <button
              type="submit"
              className='submit-btn delete'
              style={{marginTop: '30px', padding: '15px 25px', minWidth: '100%'}}
            >
              Delete HoD
            </button>
          </div>
      </div>
        </DashboardLayout>
    )
}

export default ManageHoD;