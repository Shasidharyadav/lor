const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Helper function to make API requests
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const token = localStorage.getItem('token'); // Retrieve the token from localStorage
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), // Include token if it exists
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error);
    throw error;
  }
};

// Authentication API methods
export const loginUser = (credentials) => apiRequest('/auth/login', 'POST', credentials);
export const registerUser = (userData) => apiRequest('/auth/register', 'POST', userData);

// Profile API methods
export const fetchUserProfile = () => apiRequest('/users/profile', 'GET');
export const updateUserProfile = (userData) => apiRequest('/users/profile', 'PUT', userData);

export const updatePassword = (passwordData) => apiRequest('/users/change-password', 'POST', passwordData);

export const fetchDashboardData = (role) => apiRequest(`/dashboard/${role}`, 'GET');
export const fetchLoRRequests = (role) => apiRequest(`/lor/${role}`, 'GET');
export const submitLoRRequest = (lorData) => apiRequest('/lor', 'POST', lorData);
export const updateLoRStatus = (lorId, status) => apiRequest(`/lor/${lorId}`, 'PUT', { status });
export const fetchFacultyList = () => apiRequest('/users/faculty', 'GET');
export const fetchAllFaculty = () => apiRequest('/users/faculty', 'GET');
export const fetchApplyLorMetadata = async () => apiRequest('/apply-lor/metadata', 'GET');
export const createLorRequest = (lorData) => apiRequest('/lor', 'POST', lorData);
export const getTeacherRequests = (teacherId) => apiRequest(`/lor/teacher/${teacherId}`, 'GET');
export const updateLorRequestStatus = (requestId, statusObj) => apiRequest(`/lor/${requestId}`, 'PUT', statusObj);
export const getStudentProfileById = (id) => apiRequest(`/users/${id}`, 'GET');
export const getLorRequestDetails = (requestId) => apiRequest(`/lor/${requestId}`, 'GET');

export const getAcceptedRequests = (role, userId) => {
  if (role === 'student') {
    return apiRequest(`/lor/accepted/student/${userId}`, 'GET');
  } else if (role === 'teacher') {
    return apiRequest(`/lor/accepted/teacher/${userId}`, 'GET');
  } else {
    throw new Error('Invalid user role');
  }
};

export const getPendingRequests = (role, userId) => {
  if (role === 'student') {
    return apiRequest(`/lor/pending/student/${userId}`, 'GET');
  } else if (role === 'teacher') {
    return apiRequest(`/lor/pending/teacher/${userId}`, 'GET');
  } else {
    throw new Error('Invalid user role');
  }
};
export default {
  loginUser,
  registerUser,
  fetchUserProfile,
  updateUserProfile,
  updatePassword,
  fetchDashboardData,
  fetchLoRRequests,
  submitLoRRequest,
  updateLoRStatus,
  fetchFacultyList,
  createLorRequest,
  getTeacherRequests,
  updateLorRequestStatus,
  getStudentProfileById,
  getLorRequestDetails,
  getAcceptedRequests,
  getPendingRequests
};
