import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../components/Dashboard/DashboardLayout';
import { updateLoRStatus, getTeacherRequests } from '../services/api';
import '../styles/generateLOR.css';
import successImg from '../assets/success_img.png';

const RequestLoRDeletion = () => {
    document.title = 'Request LoR Deletion';
    const user = JSON.parse(localStorage.getItem('user'));
    const [requests, setRequests] = useState([]);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        requestId: '',
    });
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);

    const confirmSubmitRef = useRef(null);

    const handleInputOnChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        if (formData.requestId) setError('');
    };

    const toggleconfirmSubmit = () => {
        if (!formData.requestId) {
            setError('Please select a request ID before submitting.');
            return;
        }
        setError('');
        setConfirmSubmit(!confirmSubmit);
    };

    useEffect(() => {
            function handleClickOutside(event) {
                if (confirmSubmitRef.current && !confirmSubmitRef.current.contains(event.target)) {
                    setConfirmSubmit(false);
                }
            }
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
    }, []);

    useEffect(() => {
        const loadRequests = async () => {
            try {
            const response = await getTeacherRequests(user.id);
            // console.log(response);
            const filteredRequests = response
                .filter(req => req.status !== "REQUESTED TO DELETE")
                .map(req => req.request_id);

            setRequests(filteredRequests);
            setLoading(false);
            }
            catch (error) {
                console.error('Error loading requests:', error);
            }
        };
        loadRequests();
    }, []);

    const handleSubmit = async () => {
        try {
            await updateLoRStatus(formData.requestId, 'REQUESTED TO DELETE');
            setFormData({ requestId: '' });
            setError('');
            setConfirmSubmit(false);
            setShowPopup(true); // Show popup
            setTimeout(() => setShowPopup(false), 1000);
            window.location.reload();
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            alert('An error occurred. Please try again.');
        }
    };
    
    return (
        <DashboardLayout>
            <h2 className='header-container'>Request Admin to Delete an LoR Record</h2>
            <p style={{ fontStyle: 'italic', color: 'var(--primary-color)' }}>Submitting this form requests the admin of the student's department to delete a specific LoR record from the database.<br />Please note that this process is irreversible—once deleted, all data associated with the LoR request will be permanently lost and cannot be recovered.<br/><br/>For any concerns or modifications before deletion, please contact the admin promptly.</p>
            <form className='form-container req-deletion-form'>
            <label className="labels required">Request ID</label>
                <select className='credentials' name='requestId' value={formData.requestId} onChange={handleInputOnChange}>
                    <option value='' disabled>Select Request ID</option>
                    {requests.map((req) => (
                    <option key={req} value={req}>
                      {req}
                    </option>
                  ))}
                </select>
                <span className='error'>{error}</span>
            </form>

            <button className='submit-btn' type='submit' onClick={toggleconfirmSubmit} style={{marginTop: '10px'}}>Submit</button>

            {confirmSubmit && (
                <div className="confirm-delete" ref={confirmSubmitRef}>
                    <p>Are you sure you want to request for DELETION of this specific record?</p>
                    <div className='confirm-delete-buttons'>
                        <button onClick={() => setConfirmSubmit(false)} className='buttons cancel'>Cancel</button>
                        <button className='buttons delete' onClick={handleSubmit}>Yes, Submit request</button>
                    </div>
                </div>
            )}

            {showPopup && (
                    <div className="popup-success">
                      <img src={successImg} alt="Success" />
                      <span>Deletion Requested successfully!</span>
                    </div>
                  )}
        </DashboardLayout>
    );
};

export default RequestLoRDeletion;