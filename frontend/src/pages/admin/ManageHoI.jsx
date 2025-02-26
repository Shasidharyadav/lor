import React, {useRef, useEffect} from 'react'
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { updateTeacherStatus } from '../../services/api';

const ManageHoI = () => {
    document.title = 'Manage HoI';
    const user = JSON.parse(localStorage.getItem('user'));
    const [confirmSubmit, setConfirmSubmit] = React.useState(false);
    const [addError, setAddError] = React.useState('');
    const [formData, setformData] = React.useState({
        id: '',
        campus: '',
        status: '',
    });
    const addRef = useRef(null);

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
            setAddError('Please fill all the fields');
            return;
        }
        if (!validateID(formData.id)) {
            setAddError('Invalid Employee ID');
            return;
        }
        if (formData.campus === '') {
            setAddError('Please select a campus');
            return;
        }
        if (formData.status === '') {
            setAddError('Please select a status');
            return;
        }
        setAddError('');
        setConfirmSubmit(true);
    }


    const handleSubmitHoI = async () => {
        // API call to add HoI
        setConfirmSubmit(false);
    }

    return (
        <DashboardLayout>
            <h2 className='header-container'>Update Head of Institute Status</h2>
            <div className='heads-form-whole'>
                <div className='heads-form'>
                    <span className='error'>{addError}</span>
                    <label className='labels'>Employee ID<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                    <input type='text' className='credentials' name='id' value={formData.id} onChange={handleInputOnChange} placeholder='Enter Employee ID'/>
                    <label className='labels'>Campus<span className='required' style={{color:'red', marginLeft: '2px'}}>*</span></label>
                    <select
                        className="credentials"
                        name="campus"
                        value={formData.campus}
                        onChange={handleInputOnChange}
                    >
                        <option value="">--Select Campus--</option>
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
                        <option value="" disabled>--Select Status--</option>
                        <option value="teacher">Faculty</option>
                        <option value="HOI">HoI</option>
                    </select>
                    <button className='submit-btn' onClick={handleSubmit} style={{marginTop: '30px', marginBottom:'30px', padding: '15px 25px', minWidth:'100%'}}>Update HoI status</button>
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
    