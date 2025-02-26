import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { getDeleteRequestedLoRs, deleteRequestByAdmin } from '../../services/api';
import successImg from '../../assets/success_img.png';

const DeleteLoRRequest = () => {
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const [lorRequests, setLoRRequests] = useState([]);
    const [error, setError] = useState(null);
    const [noRecordsMessage, setNoRecordsMessage] = useState("");
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    
    const confirmDeleteRef = useRef(null);

    useEffect(() => {
        const fetchDeleteRequestedDetails = async () => {
            const userId = user.id;
            try {
                const response = await getDeleteRequestedLoRs(userId);
                setLoRRequests(response.requests || []);
                if (response.requests.length === 0) {
                    setNoRecordsMessage("No requests found.");
                } else {
                    setNoRecordsMessage("");
                }
                console.log("LoR Requests:", response);
            }
            catch (err) {
                console.error("Error fetching LoR requests:", err);
                setError("Failed to fetch LoR requests. Please try again.");
            }
        };
        fetchDeleteRequestedDetails();
    }, []);

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
                setShowPopup(true); // Show popup
                setTimeout(() => setShowPopup(false), 1000);
                setConfirmDelete(false);
            } catch (err) {
                console.error("Error deleting LOR request:", err);
                setError("Failed to delete request. Please try again.");
            }
        };

    return (
        <DashboardLayout user={user}>
            <div className="container">
                <h2>Delete LoR Requests</h2>
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

export default DeleteLoRRequest;