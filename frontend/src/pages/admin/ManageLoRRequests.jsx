import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import '../../styles/global.css';
import '../../styles/AdminStyles.css';
import successImg from '../../assets/success_img.png';
import { getRequestsForAdmin, deleteRequestByAdmin } from '../../services/api.js';

const ManageLoRRequests = () => {
    document.title = "LoR Requests";
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const [lorRequests, setLoRRequests] = useState([]);
    const [error, setError] = useState(null);
    const [noRecordsMessage, setNoRecordsMessage] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const confirmDeleteRef = useRef(null);
    
    const [formData, setFormData] = useState({
        requestId: '',
        studentId: '',
        facultyId: ''
    });

    useEffect(() => {
        // Fetch all LoR requests on page load
        console.log("selectedRequestId", selectedRequestId);
    }, [selectedRequestId]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (confirmDeleteRef.current && !confirmDeleteRef.current.contains(event.target)) {
                setConfirmDelete(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleConfirmDelete = (requestId) => {
        setSelectedRequestId(requestId);
        setConfirmDelete(true);
    };

    const handleDelete = async () => {
        if (!selectedRequestId){
            console.log("Request ID is missing. Cannot delete request.", selectedRequestId);
            return;
        }
        try {
            console.log("Message from frontend: Deleting request with ID:", selectedRequestId);
            await deleteRequestByAdmin(selectedRequestId);
            // setLoRRequests(lorRequests.filter(request => request.request_id !== selectedRequestId));
            // Extract form data and remove empty values
            const filters = {};
            if (formData.requestId.trim()) filters.request_id = formData.requestId.trim();
            if (formData.studentId.trim()) filters.student_id = formData.studentId.trim();
            if (formData.facultyId.trim()) filters.teacher_id = formData.facultyId.trim();
            const response = await getRequestsForAdmin(filters);
            setShowPopup(true); // Show popup
            setTimeout(() => setShowPopup(false), 1000);
            // console.log("Response:", response.requests);
            setLoRRequests(response.requests || []);
            if (response.requests.length === 0) {
                setNoRecordsMessage("No requests found.");
            } else {
                setNoRecordsMessage("");
            }

            setConfirmDelete(false);
        } catch (err) {
            console.error("Error deleting LOR request:", err);
            setError("Failed to delete request. Please try again.");
        }
    };

    const handleSubmit = async () => {
        // Call the API to search for LoR requests
        try {
            setError(null); // Clear any previous errors
            setLoRRequests([]); // Clear previous results
    
            // Extract form data and remove empty values
            const filters = {};
            if (formData.requestId.trim()) filters.request_id = formData.requestId.trim();
            if (formData.studentId.trim()) filters.student_id = formData.studentId.trim();
            if (formData.facultyId.trim()) filters.teacher_id = formData.facultyId.trim(); // Assuming facultyId maps to teacher_id
    
            if (Object.keys(filters).length === 0) {
                setError("Please enter at least one search criterion.");
                return;
            }
            // console.log("Filters:", filters);
            // Fetch LOR requests with the given filters
            const response = await getRequestsForAdmin(filters);
            // console.log("Response:", response.requests);
            setLoRRequests(response.requests || []);
            if (response.requests.length === 0) {
                setNoRecordsMessage("No requests found.");
            } else {
                setNoRecordsMessage("");
            }
        } catch (err) {
            console.error("Error fetching LOR requests:", err);
            setError("Failed to fetch LOR requests. Please try again.");
        }
    };

    const isSearchEnabled = Object.values(formData).some(value => value.trim() !== '');
    
    return (
        <DashboardLayout user={user}>
            <div className="container">
                <h2>Delete LoR Requests</h2>
                <h3 style={{ color: 'var(--primary-color)' }}>Please fill out at least one field to search</h3>
                <div className="lor-requests-form">
                    <div>
                        <label>LoR Request ID</label>
                        <input 
                            type="text" 
                            name="requestId" 
                            placeholder="Request ID" 
                            value={formData.requestId} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <div>
                        <label>Student ID</label>
                        <input 
                            type="text" 
                            name="studentId" 
                            placeholder="Enter Student ID" 
                            value={formData.studentId} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <div>
                        <label>Faculty ID</label>
                        <input 
                            type="text" 
                            name="facultyId" 
                            placeholder="Enter Faculty ID" 
                            value={formData.facultyId} 
                            onChange={handleInputChange} 
                        />
                    </div>
                    <button 
                        type='submit'
                        className={`search-btn ${isSearchEnabled ? 'enabled' : ''}`} 
                        disabled={!isSearchEnabled}
                        onClick={handleSubmit}
                    >
                        Search
                    </button>
                </div>
            </div>
            {/* Show error if API fails */}
            {error && <p className="error-message">{error}</p>}

            {/* Display results in a table if lorRequests is not empty */}
            {lorRequests.length > 0 ? (
            <div className="lor-requests-table">
                <table className="custom-table">
                    <thead>
                        <tr>
                            <th>Request ID</th>
                            <th>Student ID</th>
                            <th>Faculty ID</th>
                            <th>Status</th>
                            <th>Delete Record</th>
                        </tr>
                    </thead>
                    <tbody>
                    {lorRequests.map((request, index) => (
                        <tr key={index}>
                            <td>{request.request_id}</td>
                            <td>{request.student_id}</td>
                            <td>{request.teacher_id}</td>
                            <td>{request.status}</td>
                            <td><button onClick= {() => handleConfirmDelete(request.request_id)} className='buttons delete'>Delete</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            ) : (
                <p className='no-requests-message'>{noRecordsMessage}</p>
            )}

            {/* Confirm delete dialog */}
            {confirmDelete && (
                <div className="confirm-delete" ref={confirmDeleteRef}>
                    <p>Are you sure you want to PERMENANTLY delete this record?</p>
                    <div className='confirm-delete-buttons'>
                        <button onClick={() => setConfirmDelete(false)} className='buttons cancel'>Cancel</button>
                        <button className='buttons delete' onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            )}

            {/* Popup Notification */}
            {showPopup && (
                <div className="popup-success">
                    <img src={successImg} alt="Success" />
                    <span>Record deleted successfully!</span>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ManageLoRRequests;
