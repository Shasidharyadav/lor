/********************************************************
 * adminRoutes.js
 * Express router for Admin-related endpoints.
 ********************************************************/
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// If you have an auth middleware, import it:
// const { requireAdminAuth } = require("../middleware/auth");

// GET /api/admin/dashboard-stats
router.get(
  "/dashboard-stats",
  /* requireAdminAuth, */ adminController.getDashboardStats
);

// GET /api/admin/students
router.get("/students", /* requireAdminAuth, */ adminController.getAllStudents);

// GET /api/admin/faculty
router.get("/faculty", /* requireAdminAuth, */ adminController.getAllFaculty);

// GET /api/admin/users?role=student|teacher|admin
router.get("/users", /* requireAdminAuth, */ adminController.getAllUsers);

// DELETE /api/admin/users/:id
router.delete("/users/:id", /* requireAdminAuth, */ adminController.deleteUser);

// GET /api/admin/lor-requests
router.get("/lor-requests", adminController.getRequestsForAdmin);

// DELETE /api/admin/lor-requests/:request_id
router.delete(
  "/delete-lor-request/:request_id",
  /* requireAdminAuth, */ adminController.deleteRequestByAdmin
);

// GET /api/admin/reports
router.get("/reports", /* requireAdminAuth, */ adminController.getReports);
// routes/adminRoutes.js
router.get("/reports/export", adminController.exportReports);

module.exports = router;
