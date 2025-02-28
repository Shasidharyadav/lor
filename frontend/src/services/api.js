const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

/**
 * Generic function to make requests
 */
const apiRequest = async (endpoint, method = "GET", body = null) => {
  const token = localStorage.getItem("token"); // Retrieve token from localStorage
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }), // Include token if present
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);

    let data;
    try {
      data = await response.json();
    } catch (err) {
      throw new Error("Invalid response format received from server.");
    }

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error.message || error);
    throw error;
  }
};

/* ------------------- Auth API Methods ------------------- */
export const loginUser = (credentials) =>
  apiRequest("/auth/login", "POST", credentials);

export const registerUser = (userData) =>
  apiRequest("/auth/register", "POST", userData);
export const forgotPassword = (email) =>
  apiRequest("/auth/forgot-password", "POST", { email });

export const resetPassword = (token, password) =>
  apiRequest("/auth/reset-password", "POST", { token, password });

/* ------------------- Profile API Methods ------------------- */
export const fetchUserProfile = () => apiRequest("/users/profile", "GET");

export const updateUserProfile = (userData) =>
  apiRequest("/users/profile", "PUT", userData);

export const updatePassword = (passwordData) =>
  apiRequest("/users/change-password", "POST", passwordData);

/* ------------------- LoR Requests & Related ------------------- */

/**
 * Submit a new LOR request (student side)
 */
export const submitLoRRequest = (lorData) =>
  apiRequest("/lor", "POST", lorData);

/**
 * Create an LoR request (if it's a different flow from submitLoRRequest)
 */
export const createLorRequest = (lorData) =>
  apiRequest("/lor", "POST", lorData);

export const trackUniversities = (uniData) =>
  apiRequest("/lor/universities", "POST", uniData);

/**
 * Update LoR status (ACCEPTED, DECLINED, etc.)
 * The param 'status' is a string (e.g., 'ACCEPTED'),
 * and we pass it as { status } in the body.
 */
export const updateLoRStatus = (lorId, status) =>
  apiRequest(`/lor/${lorId}`, "PUT", { status });

/**
 * Retrieve details of a single LoR request
 */
export const getLorRequestDetails = (requestId) =>
  apiRequest(`/lor/${requestId}`, "GET");

/**
 * Finalize a LoR request (PATCH) with final letter content + set status=FINISHED
 */
export const finalizeLorRequest = (requestId, finalizeData) =>
  apiRequest(`/lor/${requestId}/finalize`, "PATCH", finalizeData);

/**
 * Re-export the name "updateLorRequestStatus" if you prefer that function signature:
 *    updateLorRequestStatus(requestId, { status: 'ACCEPTED' })
 */
export const updateLorRequestStatus = (requestId, statusObj) =>
  apiRequest(`/lor/${requestId}`, "PUT", statusObj);

export const saveLoRContent = (requestId, content) =>
  apiRequest(`/lor/${requestId}/content`, "PATCH", { content });

/* ------------------- Teacher / Student Request Lists ------------------- */

/**
 * Get all LoR requests for a teacher (maybe /lor/teacher/:teacherId)
 */
export const getTeacherRequests = (teacherId) =>
  apiRequest(`/lor/teacher/${teacherId}`, "GET");

/**
 * Get all LoR requests for a student (maybe /lor/student/:studentId)
 */
export const getStudentRequests = (studentId) =>
  apiRequest(`/lor/student/${studentId}`, "GET");

/**
 * If your backend has /lor/pending/teacher/:teacherId or /lor/pending/student/:studentId
 */
export const getPendingRequests = (role, userId) => {
  if (role === "student") {
    return apiRequest(`/lor/pending/student/${userId}`, "GET");
  } else if (role === "teacher") {
    return apiRequest(`/lor/pending/teacher/${userId}`, "GET");
  }
  throw new Error("Invalid user role for pending requests");
};

/**
 * If your backend has /lor/accepted/teacher/:teacherId or /lor/accepted/student/:studentId
 */
export const getAcceptedRequests = (role, userId) => {
  if (role === "student") {
    return apiRequest(`/lor/accepted/student/${userId}`, "GET");
  } else if (role === "teacher") {
    return apiRequest(`/lor/accepted/teacher/${userId}`, "GET");
  }
  throw new Error("Invalid user role for accepted requests");
};

/* ------------------- Additional Utilities ------------------- */

/**
 * (Optional) If you had a route for "faculty" or "apply-lor/metadata"
 */
export const fetchFacultyList = () => apiRequest("/users/faculty", "GET");

export const fetchApplyLorMetadata = () =>
  apiRequest("/apply-lor/metadata", "GET");

/**
 * Example: fetch a student's profile by ID
 */
export const getStudentProfileById = (id) => apiRequest(`/users/${id}`, "GET");

/**
 * Example: fetch student's LoR counts by status
 * (requires a route: /lor/student/:studentId/stats -> { pending, accepted, ... })
 */
export const fetchStudentLorCounts = async (studentId) => {
  const res = await apiRequest(`/lor/student/${studentId}/stats`, "GET");
  return res; // e.g. { pending: 2, accepted: 1, finished: 3, declined: 1, expired: 0 }
};

export const fetchDeclinedTeachers = async (studentId) => {
  return apiRequest(`/lor/declined/student/${studentId}`, "GET");
};

export const fetchTeacherLorCounts = async (teacherId) => {
  return apiRequest(`/lor/teacher/${teacherId}/stats`, "GET");
};

export const fetchAdminDashboardStats = () =>
  apiRequest("/admin/dashboard-stats", "GET");

export const fetchAllFaculty = (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  return apiRequest(`/admin/faculty?${queryParams.toString()}`, "GET");
};

/**
 * Fetch all students with optional filters
 */
export const fetchAllStudents = (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  return apiRequest(`/admin/students?${queryParams.toString()}`, "GET");
};

/**
 * Fetch all users, optionally filtered by role=? (student|teacher|admin)
 */
export const fetchAllUsers = (role = "") => {
  const query = role ? `?role=${role}` : "";
  return apiRequest(`/admin/users${query}`, "GET");
};

/**
 * Delete user by ID (from any table: student, teacher, or admin)
 */
export const deleteUser = (userId) => {
  return apiRequest(`/admin/users/${userId}`, "DELETE");
};

/**
 * Fetch LOR requests based on optional filters: request_id, student_id, teacher_id
 */
export const getRequestsForAdmin = (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  return apiRequest(`/admin/lor-requests?${queryParams.toString()}`, "GET");
};

/**
 * Delete LOR request by ID
 */
export const deleteRequestByAdmin = (requestId) => {
  return apiRequest(`/admin/delete-lor-request/${requestId}`, "DELETE");
};

/**
 * Fetch all reports
 */
export const fetchReports = () => {
  return apiRequest("/admin/reports", "GET");
};

/**
 * (Optional) If you need to create a user from admin side
 */
export const createUserByAdmin = (formData) => {
  return apiRequest("/admin/add-user", "POST", formData);
};

/**
 * get analysis for admin view analysis page
 */
export const getAnalysis = (filters = {}) => {
  const queryParams = new URLSearchParams(filters);
  return apiRequest(`/admin/analysis?${queryParams.toString()}`, "GET");
};

export const updateTeacherStatus = (teacherId, newStatus) => {
  return apiRequest(`/admin/teacher/${teacherId}/status`, "PATCH", {
    status: newStatus,
  });
};
export const createDepartmentAdmin = (formData) => {
  return apiRequest("/admin/add-department-admin", "POST", formData);
};

export const getDeleteRequestedLoRs = (adminId) => {
  return apiRequest(`/admin/get-delete-lor-requests/${adminId}`, "GET");
};

/**
 * Example: get admin dashboard stats (students, teachers, admins, totalUsers)
 */
/* ------------------- Export All Methods ------------------- */
export const bulkUploadUsers = (data) => {
  return apiRequest("/admin/bulk-upload", "POST", data);
};

export default {
  // Auth
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,

  // Profile
  fetchUserProfile,
  updateUserProfile,
  updatePassword,
  fetchDeclinedTeachers,

  // LoR Requests
  submitLoRRequest,
  createLorRequest,
  updateLoRStatus,
  getLorRequestDetails,
  finalizeLorRequest,
  updateLorRequestStatus, // Re-export with your old name
  saveLoRContent,

  // Teacher/Student lists
  getTeacherRequests,
  getStudentRequests,
  getPendingRequests,
  getAcceptedRequests,

  // Additional
  fetchFacultyList,
  fetchApplyLorMetadata,
  getStudentProfileById,
  fetchStudentLorCounts,
  fetchTeacherLorCounts,
  fetchAdminDashboardStats,
  createUserByAdmin,
  fetchReports,
  deleteUser,
  getRequestsForAdmin,
  deleteRequestByAdmin,
  fetchAllUsers,
  fetchAllStudents,
  fetchAllFaculty,
  getAnalysis,
  updateTeacherStatus,
  createDepartmentAdmin,
  getDeleteRequestedLoRs,
  bulkUploadUsers
};
