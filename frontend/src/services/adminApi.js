// src/services/adminApi.js
import { apiRequest } from "./api";

/**
 * Fetch all faculty with optional filters (campus, school, department, specialization)
 */
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
 * Example: get admin dashboard stats (students, teachers, admins, totalUsers)
 */
export const fetchAdminDashboardStats = () => {
  return apiRequest("/admin/dashboard-stats", "GET");
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
