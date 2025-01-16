// backend/controllers/lorController.js

const {
  createLorRequest,
  getRequestsByTeacher,
  getRequestsByStudent,
  updateLorStatus,
  findLorRequestById,
  getPendingRequestsByTeacher,
  getPendingRequestsByStudent,
  getAcceptedRequestsByStudent,
  getAcceptedRequestsByTeacher,
  finalizeLorRequest,
  countRequestsByStatusStudent,
  countRequestsByStatusTeacher,
  findDeclinedTeachersByStudent,
  
} = require("../models/lorModel");
const { findUserById } = require("../models/userModel");

/**
 * Handler to apply for a new LoR
 */
exports.applyLor = async (req, res) => {
  try {
    const lorData = req.body;
    const newRequestId = await createLorRequest(lorData);
    return res.status(201).json({
      message: "LoR request submitted successfully.",
      request_id: newRequestId,
    });
  } catch (err) {
    console.error("Error applying for LoR:", err);
    return res.status(500).json({ message: "Server error while applying for LoR." });
  }
};

/**
 * Handler to get all LoR requests for a specific teacher
 */
exports.getTeacherRequests = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    const requests = await getRequestsByTeacher(teacherId);
    return res.json(requests);
  } catch (err) {
    console.error("Error fetching teacher LoR requests:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching LoR requests." });
  }
};

/**
 * Handler to get all LoR requests for a specific student
 */
exports.getStudentRequests = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    const requests = await getRequestsByStudent(studentId);
    return res.json(requests);
  } catch (err) {
    console.error("Error fetching Student LoR requests:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching LoR requests." });
  }
};

/**
 * Handler to update the status of a LoR request (APPROVED, DECLINED, or EXPIRED)
 */
exports.updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body;

    if (!["APPROVED", "DECLINED", "EXPIRED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await updateLorStatus(requestId, status);
    return res.json({ message: `LoR request ${requestId} updated to ${status}.` });
  } catch (err) {
    console.error("Error updating LoR status:", err);
    return res
      .status(500)
      .json({ message: "Server error while updating LoR status." });
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
      return res.status(404).json({ message: "LoR request not found" });
    }

    const student = await findUserById(lorRequest.student_id);
    if (!student) {
      return res.status(404).json({ message: "Associated student not found" });
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

      // Final letter details from teacher
      name_address: lorRequest.name_address,
      name_signature: lorRequest.name_signature,
      teacher_designation: lorRequest.teacher_designation,
      teacher_department: lorRequest.teacher_department,
      teacher_campus: lorRequest.teacher_campus,
      teacher_email: lorRequest.teacher_email,
      teacher_phone: lorRequest.teacher_phone,

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

    return res.json(detailedRequest);
  } catch (err) {
    console.error("Error fetching LoR request details:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching LoR request details." });
  }
};

/**
 * Handler to get pending LoR requests for a specific teacher
 */
exports.getPendingTeacherRequests = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required." });
    }

    const pendingRequests = await getPendingRequestsByTeacher(teacherId);

    // Return empty array if no pending requests
    if (!pendingRequests || pendingRequests.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(pendingRequests);
  } catch (err) {
    console.error("Error fetching pending teacher LoR requests:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching pending LoR requests." });
  }
};

exports.getPendingStudentRequests = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    const pendingRequests = await getPendingRequestsByStudent(studentId);
    return res.status(200).json(pendingRequests);
  } catch (err) {
    console.error("Error fetching pending student LoR requests:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching pending LoR requests." });
  }
};

exports.getAcceptedRequestsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;

    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    const acceptedRequests = await getAcceptedRequestsByStudent(studentId);

    if (!acceptedRequests || acceptedRequests.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(acceptedRequests);
  } catch (err) {
    console.error("Error fetching accepted student LoR requests:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching accepted LoR requests." });
  }
};

exports.getAcceptedRequestsByTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required." });
    }

    const acceptedRequests = await getAcceptedRequestsByTeacher(teacherId);

    if (!acceptedRequests || acceptedRequests.length === 0) {
      return res.status(200).json([]);
    }

    return res.status(200).json(acceptedRequests);
  } catch (err) {
    console.error("Error fetching accepted teacher LoR requests:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching accepted LoR requests." });
  }
};

/**
 * FINALIZE: Teacher can finalize LoR content, 
 * store their signature details, and set status to 'FINISHED'.
 */
exports.finalizeLor = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const {
      lor_content,
      name_address,
      name_signature,
      teacher_designation,
      teacher_department,
      teacher_campus,
      teacher_email,
      teacher_phone,
    } = req.body;

    await finalizeLorRequest(requestId, {
      lor_content,
      name_address,
      name_signature,
      teacher_designation,
      teacher_department,
      teacher_campus,
      teacher_email,
      teacher_phone,
    });

    return res
      .status(200)
      .json({ message: "LoR request finalized (status set to FINISHED)." });
  } catch (err) {
    console.error("Error finalizing LoR:", err);
    return res.status(500).json({ message: "Server error while finalizing LoR." });
  }
};
exports.getStudentStats = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    // We'll use helper functions from the model to count each status
    const pendingCount = await countRequestsByStatusStudent(studentId, "PENDING");
    const approvedCount = await countRequestsByStatusStudent(studentId, "APPROVED");
    const finishedCount = await countRequestsByStatusStudent(studentId, "FINISHED");
    const declinedCount = await countRequestsByStatusStudent(studentId, "DECLINED");
    const expiredCount = await countRequestsByStatusStudent(studentId, "EXPIRED");

    return res.json({
      pending: pendingCount,
      approved: approvedCount,
      finished: finishedCount,
      declined: declinedCount,
      expired: expiredCount,
    });
  } catch (error) {
    console.error("Error fetching student LoR stats:", error);
    return res.status(500).json({ message: "Server error while fetching student stats." });
  }
};
exports.getTeacherStats = async (req, res) => {
  try {
    const { teacherId } = req.params;
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required." });
    }

    // Query each status count
    const pendingCount = await countRequestsByStatusTeacher(teacherId, "PENDING");
    const approvedCount = await countRequestsByStatusTeacher(teacherId, "APPROVED");
    const finishedCount = await countRequestsByStatusTeacher(teacherId, "FINISHED");
    const declinedCount = await countRequestsByStatusTeacher(teacherId, "DECLINED");
    const expiredCount = await countRequestsByStatusTeacher(teacherId, "EXPIRED");

    return res.json({
      pending: pendingCount,
      approved: approvedCount,
      finished: finishedCount,
      declined: declinedCount,
      expired: expiredCount,
    });
  } catch (error) {
    console.error("Error fetching teacher LoR stats:", error);
    res.status(500).json({ message: "Server error while fetching teacher stats." });
  }
};
exports.getDeclinedTeachersByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ message: "studentId is required." });
    }

    const teacherIds = await findDeclinedTeachersByStudent(studentId);
    return res.status(200).json(teacherIds);
  } catch (err) {
    console.error("Error fetching declined teachers for student:", err);
    return res
      .status(500)
      .json({ message: "Server error fetching declined teachers." });
  }
};