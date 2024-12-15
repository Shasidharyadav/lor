const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; 

const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
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

// API methods
export const loginUser = (credentials) => apiRequest('/api/auth/login', 'POST', credentials);

export const registerUser = (userData) => apiRequest('/api/users/register', 'POST', userData);

export const fetchDashboardData = (role) => apiRequest(`/api/dashboard/${role}`);

export const fetchLoRRequests = (role) => apiRequest(`/api/lor/${role}`);

export const submitLoRRequest = (lorData) => apiRequest('/api/lor', 'POST', lorData);

export const updateLoRStatus = (lorId, status) => apiRequest(`/api/lor/${lorId}`, 'PUT', { status });
