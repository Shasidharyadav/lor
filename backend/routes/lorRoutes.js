const express = require('express');
const router = express.Router();
const {
  applyLor,
  getTeacherRequests,
  updateRequestStatus,
  getLorRequestDetails,
  getPendingTeacherRequests,
  getPendingStudentRequests
} = require('../controllers/lorController');

router.post('/', applyLor);
router.get('/teacher/:teacherId', getTeacherRequests);
router.get('/pending/teacher/:teacherId', getPendingTeacherRequests); 
router.get('/pending/student/:studentId', getPendingStudentRequests);
router.put('/:requestId', updateRequestStatus);
router.get('/:requestId', getLorRequestDetails);

module.exports = router;
