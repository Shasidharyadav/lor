import React, { useState } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { updateLoRStatus } from '../services/api';
import '../styles/generateLOR.css';

const RequestLoRDeletion = () => {
    document.title = 'Request LoR Deletion';
    const [formData, setFormData] = useState({
        requestId: '',
        studentId: '',
        facultyId: ''
    });
    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async () => {
        try {
            await updateLoRStatus(formData.requestId, 'REQUESTED TO DELETE');
            alert('Deletion request submitted successfully!');
            setFormData({
                requestId: '',
                studentId: '',
                facultyId: ''
            });
            setConfirmSubmit(false);
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };
    
    return (
        <DashboardLayout>
            <h2 className='header-container'>Request Admin to Delete an LoR Record</h2>
            <p style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Submitting this form requests the admin of the student's department to delete a specific LoR record from the database.<br />Please note that this process is irreversible—once deleted, all data associated with the LoR request will be permanently lost and cannot be recovered.<br/><br/>For any concerns or modifications before deletion, please contact the admin promptly.</p>
            <form className='form-container req-deletion-form'>
                <label className='labels'>Request ID<span className='required' style={{color:'red', marginLeft:'2px'}}>*</span></label>
                <input className='credentials' name='requestId' value={formData.requestId} type='text' placeholder='Enter Request ID' onChange={handleInputChange} required/>
                <label className='labels'>Student ID<span className='required' style={{color:'red', marginLeft:'2px'}}>*</span></label>
                <input className='credentials' name='studentId' value={formData.studentId} type='text' placeholder='Enter Student ID' onChange={handleInputChange} required/>
                <label className='labels'>Faculty ID<span className='required' style={{color:'red', marginLeft:'2px'}}>*</span></label>
                <input className='credentials' name='facultyId' value={formData.facultyId} type='text' placeholder='Enter Faculty ID' onChange={handleInputChange} required/>
            </form>
            <button className='submit-btn' type='submit' onClick={() => setConfirmSubmit(true)}>Submit</button>

            {confirmSubmit && (
                <div className="confirm-delete">
                    <p>Are you sure you want to request for DELETION of this specific record?</p>
                    <div className='confirm-delete-buttons'>
                        <button onClick={() => setConfirmSubmit(false)} className='buttons cancel'>Cancel</button>
                        <button className='buttons delete' onClick={handleSubmit}>Yes, Submit request</button>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default RequestLoRDeletion;