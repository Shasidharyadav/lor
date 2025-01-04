const express = require('express');
const router = express.Router();
const {
  applyLor,
  getTeacherRequests,
  updateRequestStatus,
  getLorRequestDetails,
  getPendingTeacherRequests,
  getPendingStudentRequests,
  getAcceptedRequestsByStudent,
  getAcceptedRequestsByTeacher
} = require('../controllers/lorController');

router.post('/', applyLor);
router.get('/teacher/:teacherId', getTeacherRequests);
router.get('/pending/teacher/:teacherId', getPendingTeacherRequests); 
router.get('/pending/student/:studentId', getPendingStudentRequests);
router.get('/accepted/teacher/:teacherId', getAcceptedRequestsByTeacher);
router.get('/accepted/student/:studentId', getAcceptedRequestsByStudent);
router.put('/:requestId', updateRequestStatus);
router.get('/:requestId', getLorRequestDetails);

module.exports = router;
