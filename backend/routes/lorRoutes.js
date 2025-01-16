// routes/lorRoutes.js

const express = require("express");
const router = express.Router();
const {
  applyLor,
  getTeacherRequests,
  getStudentRequests,
  updateRequestStatus,
  getLorRequestDetails,
  getPendingTeacherRequests,
  getPendingStudentRequests,
  getAcceptedRequestsByStudent,
  getAcceptedRequestsByTeacher,
  finalizeLor,
  getStudentStats,
  getTeacherStats,
  getDeclinedTeachersByStudent,
} = require("../controllers/lorController");

/**
 * 1) CREATE /lor: Submit or Apply for an LoR (student side)
 */
router.post("/", applyLor);

/**
 * 2) STATS route must come before /student/:studentId
 *    so /student/123/stats does not get overridden by /student/:studentId
 */
router.get("/student/:studentId/stats", getStudentStats);
router.get("/teacher/:teacherId/stats", getTeacherStats);


/**
 * 3) Teacher-specific routes
 */
router.get("/teacher/:teacherId", getTeacherRequests);
router.get("/pending/teacher/:teacherId", getPendingTeacherRequests);
router.get("/accepted/teacher/:teacherId", getAcceptedRequestsByTeacher);

/**
 * 4) Student-specific routes
 */
router.get("/student/:studentId", getStudentRequests);
router.get("/pending/student/:studentId", getPendingStudentRequests);
router.get("/accepted/student/:studentId", getAcceptedRequestsByStudent);

/**
 * 5) Finalize route must come before the generic /:requestId 
 *    so /:requestId/finalize does not conflict with /:requestId
 */
router.patch("/:requestId/finalize", finalizeLor);

/**
 * 6) Generic routes for a single request by ID
 */
router.get("/:requestId", getLorRequestDetails);
router.put("/:requestId", updateRequestStatus);
router.get('/declined/student/:studentId', getDeclinedTeachersByStudent);


module.exports = router;
