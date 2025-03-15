import React, {useRef, useEffect, useState} from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { updateTeacherStatus } from '../../services/api';
import successImg from '../../assets/success_img.png';

const ManageHoI = () => {
    document.title = 'Manage HoI';
    const user = JSON.parse(localStorage.getItem('user'));
    const [confirmSubmit, setConfirmSubmit] = React.useState(false);
    const [formData, setformData] = React.useState({
        id: '',
        campus: '',
        status: '',
    });
    const addRef = useRef(null);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);

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
      

    const handleInputOnChange = (e) => {
        setformData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

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


    const handleSubmitHoI = async () => {
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
        <DashboardLayout>
            {/* Popup Notification */}
                {showPopup && (
                <div className="popup-success">
                    <img src={successImg} alt="Success" />
                    <span>{success}</span>
                </div>
            )}
            <h2 className='header-container'>Manage Head of Institute</h2>
            <div className='heads-form-whole'>
                <div className='heads-form'>
                    <span className='error'>{error}</span>
                    <label className='labels'>Employee ID<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                    <input type='text' className='credentials' name='id' value={formData.id} onChange={handleInputOnChange} placeholder='Enter Employee ID'/>
                    <label className='labels'>Campus<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                    <select
                        className="credentials"
                        name="campus"
                        value={formData.campus}
                        onChange={handleInputOnChange}
                    >
                        <option value="" disabled>Select Campus</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Vishakhapatnam">Vishakhapatnam</option>
                    </select>
                    <label className='labels'>Status<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                    <select 
                        className="credentials"
                        name="status"
                        value={formData.status}
                        onChange={handleInputOnChange}
                    >
                        <option value="" disabled>Select Status</option>
                        <option value="teacher">Faculty</option>
                        <option value="HOI">HoI</option>
                    </select>
                    <button className='submit-btn' onClick={handleSubmit} style={{marginTop: '30px', marginBottom:'30px', padding: '15px 25px', minWidth:'100%'}}>Submit</button>
                </div>
            </div>
            {confirmSubmit && (
                <div className="confirm-delete" ref={addRef}>
                    <p>Are you sure you want to update the status of {formData.id} as {formData.status === 'teacher' ? 'Faculty' : 'HoI'} for {formData.campus}?</p>
                    <div className='confirm-delete-buttons'>
                        <button onClick={() => setConfirmSubmit(false)} className='buttons cancel'>No, Cancel</button>
                        <button className='buttons delete' style={{backgroundColor:'var(--primary-color)'}} onClick={handleSubmitHoI}>YES,Submit Request</button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default ManageHoI;
    