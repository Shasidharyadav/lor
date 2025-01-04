// backend/controllers/lorController.js

const {
  createLorRequest,
  getRequestsByTeacher,
  updateLorStatus,
  findLorRequestById,
  getPendingRequestsByTeacher,
  getPendingRequestsByStudent,
  getAcceptedRequestsByStudent,
  getAcceptedRequestsByTeacher,

} = require('../models/lorModel');
const { findUserById } = require('../models/userModel');

/**
 * Handler to apply for a new LoR
 */
exports.applyLor = async (req, res) => {
  try {
    const lorData = req.body;
    const newRequestId = await createLorRequest(lorData);
    res.status(201).json({ message: 'LoR request submitted successfully.', request_id: newRequestId });
  } catch (err) {
    console.error('Error applying for LoR:', err);
    res.status(500).json({ message: 'Server error while applying for LoR.' });
  }
};

/**
 * Handler to get all LoR requests for a specific teacher
 */
exports.getTeacherRequests = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const requests = await getRequestsByTeacher(teacherId);
    res.json(requests);
  } catch (err) {
    console.error('Error fetching teacher LoR requests:', err);
    res.status(500).json({ message: 'Server error while fetching LoR requests.' });
  }
};

/**
 * Handler to update the status of a LoR request
 */
exports.updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body;

    if (!['APPROVED', 'DECLINED'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    await updateLorStatus(requestId, status);
    res.json({ message: `LoR request ${requestId} updated to ${status}.` });
  } catch (err) {
    console.error('Error updating LoR status:', err);
    res.status(500).json({ message: 'Server error while updating LoR status.' });
  }
};

/**
 * Handler to get detailed LoR request including student data
 */
exports.getLorRequestDetails = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const lorRequest = await findLorRequestById(requestId);

    if (!lorRequest) {
      return res.status(404).json({ message: 'LoR request not found' });
    }

    const student = await findUserById(lorRequest.student_id);
    if (!student) {
      return res.status(404).json({ message: 'Associated student not found' });
    }

    // Combine LoR request data with student data
    const detailedRequest = {
      request_id: lorRequest.request_id,
      teacher_id: lorRequest.teacher_id,
      student_id: lorRequest.student_id,
      campus: lorRequest.campus,
      school: lorRequest.school,
      department: lorRequest.department,
      specialization: lorRequest.specialization,
      lor_content: lorRequest.lor_content,
      status: lorRequest.status,
      created_at: lorRequest.created_at,
      universities: lorRequest.universities, // Already parsed as object

      // Student Info
      student_info: {
        id: student.id,
        name: student.name,
        gitamEmail: student.gitamEmail,
        personalEmail: student.personalEmail,
        campus: student.campus,
        school: student.school,
        department: student.department,
        specialization: student.specialization,
        yearOfPassout: student.yearOfPassout,
      },
    };

    res.json(detailedRequest);
  } catch (err) {
    console.error('Error fetching LoR request details:', err);
    res.status(500).json({ message: 'Server error while fetching LoR request details.' });
  }
};
/**
 * Handler to get pending LoR requests for a specific teacher
 */
exports.getPendingTeacherRequests = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    // Validate teacherId presence
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required.' });
    }

    // Fetch pending requests from the model
    const pendingRequests = await getPendingRequestsByTeacher(teacherId);

    // Check if any requests are found
    if (!pendingRequests || pendingRequests.length === 0) {
      return res.status(200).json([]); // Return empty array if no pending requests
    }

    res.status(200).json(pendingRequests);
  } catch (err) {
    console.error('Error fetching pending teacher LoR requests:', err);
    res.status(500).json({ message: 'Server error while fetching pending LoR requests.' });
  }
};
exports.getPendingStudentRequests = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required.' });
    }

    const pendingRequests = await getPendingRequestsByStudent(studentId);

    res.status(200).json(pendingRequests);
  } catch (err) {
    console.error('Error fetching pending student LoR requests:', err);
    res.status(500).json({ message: 'Server error while fetching pending LoR requests.' });
  }
};
exports.getAcceptedRequestsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    // Validate studentId presence
    if (!studentId) {
      return res.status(400).json({ message: 'Student ID is required.' });
    }

    // Fetch accepted requests from the model
    const acceptedRequests = await getAcceptedRequestsByStudent(studentId);

    // Check if any accepted requests are found
    if (!acceptedRequests || acceptedRequests.length === 0) {
      return res.status(200).json([]); // Return empty array if no accepted requests
    }

    res.status(200).json(acceptedRequests);
  } catch (err) {
    console.error('Error fetching accepted student LoR requests:', err);
    res.status(500).json({ message: 'Server error while fetching accepted LoR requests.' });
  }
};

exports.getAcceptedRequestsByTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    // Validate teacherId presence
    if (!teacherId) {
      return res.status(400).json({ message: 'Teacher ID is required.' });
    }

    // Fetch accepted requests from the model
    const acceptedRequests = await getAcceptedRequestsByTeacher(teacherId);

    // Check if any accepted requests are found
    if (!acceptedRequests || acceptedRequests.length === 0) {
      return res.status(200).json([]); // Return empty array if no accepted requests
    }

    res.status(200).json(acceptedRequests);
  } catch (err) {
    console.error('Error fetching accepted teacher LoR requests:', err);
    res.status(500).json({ message: 'Server error while fetching accepted LoR requests.' });
  }
};
