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

    // Try to parse JSON response
    let data;
    try {
      data = await response.json();
    } catch (err) {
      // If response is not JSON, throw a parsing error
      throw new Error('Invalid response format received from server.');
    }

    if (!response.ok) {
      // Throw an error with a meaningful message from the server
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error.message || error);
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

// Dashboard and LoR API methods
export const fetchDashboardData = (role) => apiRequest(`/dashboard/${role}`, 'GET');
export const fetchLoRRequests = (role) => apiRequest(`/lor/${role}`, 'GET');
export const submitLoRRequest = (lorData) => apiRequest('/lor', 'POST', lorData);
export const updateLoRStatus = (lorId, status) => apiRequest(`/lor/${lorId}`, 'PUT', { status });
export const fetchFacultyList = () => apiRequest('/users/faculty', 'GET');
export const fetchApplyLorMetadata = () => apiRequest('/apply-lor/metadata', 'GET');
export const createLorRequest = (lorData) => apiRequest('/lor', 'POST', lorData);

// Request-specific API methods
export const getTeacherRequests = (teacherId) => apiRequest(`/lor/teacher/${teacherId}`, 'GET');
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
export const getLorRequestDetails = (requestId) => apiRequest(`/lor/${requestId}`, 'GET');
export const updateLorRequestStatus = (requestId, statusObj) => apiRequest(`/lor/${requestId}`, 'PUT', statusObj);

// Miscellaneous API methods
export const getStudentProfileById = (id) => apiRequest(`/users/${id}`, 'GET');

// Export all methods as default
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
  fetchApplyLorMetadata,
  createLorRequest,
  getTeacherRequests,
  getAcceptedRequests,
  getPendingRequests,
  getLorRequestDetails,
  updateLorRequestStatus,
  getStudentProfileById,
};
