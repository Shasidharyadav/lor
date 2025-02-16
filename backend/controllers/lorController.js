// controllers/lorController.js

const {
  createLorRequest,
  getRequestsByTeacher,
  getRequestsByStudent,
  updateLorStatus,
  findLorRequestById,
  saveLoRContent,
  getPendingRequestsByTeacher,
  getPendingRequestsByStudent,
  getAcceptedRequestsByStudent,
  getAcceptedRequestsByTeacher,
  finalizeLorRequest,
  countRequestsByStatusStudent,
  countRequestsByStatusTeacher,
  findDeclinedTeachersByStudent,
  trackUniversities,
} = require("../models/lorModel");

const { findUserById } = require("../models/userModel");

/**
 * Apply for a new LoR
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
    return res
      .status(500)
      .json({ message: "Server error while applying for LoR." });
  }
};

/**
 * Get all LoR requests for a specific teacher
 * Now includes student_name (via join).
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
 * Get all LoR requests for a specific student
 * Now includes teacher_name (via join).
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
 * Update the status of a request (ACCEPTED, DECLINED, EXPIRED, etc.)
 */
exports.updateRequestStatus = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { status } = req.body;

    if (!["ACCEPTED", "DECLINED", "EXPIRED"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    await updateLorStatus(requestId, status);
    return res.json({
      message: `LoR request ${requestId} updated to ${status}.`,
    });
  } catch (err) {
    console.error("Error updating LoR status:", err);
    return res
      .status(500)
      .json({ message: "Server error while updating LoR status." });
  }
};

/**
 * Save LoR content (draft) for a request
 */
exports.saveLoRContent = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const { content } = req.body;

    await saveLoRContent(requestId, content);
    return res.json({ message: "LoR content saved successfully." });
  } catch (err) {
    console.error("Error saving LoR content:", err);
    return res
      .status(500)
      .json({ message: "Server error while saving LoR content." });
  }
};

/**
 * Get detailed LoR request including student data
 * This does not directly join teacher_name or student_name,
 * but you can do so if you want to also get teacher_name.
 */
exports.getLorRequestDetails = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    const lorRequest = await findLorRequestById(requestId);

    if (!lorRequest) {
      return res.status(404).json({ message: "LoR request not found" });
    }

    // Fetch the student
    const student = await findUserById(lorRequest.student_id);
    if (!student) {
      return res.status(404).json({ message: "Associated student not found" });
    }

    // NEW: Fetch the teacher user
    const teacher = await findUserById(lorRequest.teacher_id);
    if (!teacher) {
      return res.status(404).json({ message: "Associated teacher not found" });
    }

    // Combine LoR request data with both student and teacher data
    const detailedRequest = {
      request_id: lorRequest.request_id,
      teacher_id: lorRequest.teacher_id,
      student_id: lorRequest.student_id,

      // Fields from the lor_requests table
      title: lorRequest.title,
      deadline: lorRequest.deadline,
      campus: lorRequest.campus,
      school: lorRequest.school,
      department: lorRequest.department,
      specialization: lorRequest.specialization,
      lor_content: lorRequest.lor_content,
      status: lorRequest.status,
      created_at: lorRequest.created_at,
      universities: lorRequest.universities,

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

      // NEW: Teacher Info
      teacher_info: {
        id: teacher.id,
        name: teacher.name,
        gitamEmail: teacher.gitamEmail,
        personalEmail: teacher.personalEmail,
        campus: teacher.campus,
        school: teacher.school,
        department: teacher.department,
        specialization: teacher.specialization,
        designation: teacher.designation,
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
 * Get pending LoR requests for a specific teacher
 * Joins student_users => student_name
 */
exports.getPendingTeacherRequests = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required." });
    }

    const pendingRequests = await getPendingRequestsByTeacher(teacherId);
    return res.status(200).json(pendingRequests);
  } catch (err) {
    console.error("Error fetching pending teacher LoR requests:", err);
    return res
      .status(500)
      .json({ message: "Server error fetching pending LoR requests." });
  }
};

/**
 * Get pending LoR requests for a specific student
 * Joins teacher_users => teacher_name
 */
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
      .json({ message: "Server error fetching pending LoR requests." });
  }
};

/**
 * Get accepted (ACCEPTED, FINISHED, EXPIRED) LoR requests for a student
 * Joins teacher_users => teacher_name
 */
exports.getAcceptedRequestsByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId;
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    const acceptedRequests = await getAcceptedRequestsByStudent(studentId);
    return res.status(200).json(acceptedRequests);
  } catch (err) {
    console.error("Error fetching accepted student LoR requests:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching accepted LoR requests." });
  }
};

/**
 * Get accepted (ACCEPTED, FINISHED, EXPIRED) LoR requests for a teacher
 * Joins student_users => student_name
 */
exports.getAcceptedRequestsByTeacher = async (req, res) => {
  try {
    const teacherId = req.params.teacherId;
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required." });
    }

    const acceptedRequests = await getAcceptedRequestsByTeacher(teacherId);
    return res.status(200).json(acceptedRequests);
  } catch (err) {
    console.error("Error fetching accepted teacher LoR requests:", err);
    return res
      .status(500)
      .json({ message: "Server error while fetching accepted LoR requests." });
  }
};

/**
 * FINALIZE: Teacher finalizes LoR => status=FINISHED
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
    return res
      .status(500)
      .json({ message: "Server error while finalizing LoR." });
  }
};

/**
 * Stats for a student (pending, accepted, finished, declined, expired counts)
 */
exports.getStudentStats = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ message: "Student ID is required." });
    }

    const pendingCount = await countRequestsByStatusStudent(
      studentId,
      "PENDING"
    );
    const acceptedCount = await countRequestsByStatusStudent(
      studentId,
      "ACCEPTED"
    );
    const finishedCount = await countRequestsByStatusStudent(
      studentId,
      "FINISHED"
    );
    const declinedCount = await countRequestsByStatusStudent(
      studentId,
      "DECLINED"
    );
    const expiredCount = await countRequestsByStatusStudent(
      studentId,
      "EXPIRED"
    );

    return res.json({
      pending: pendingCount,
      accepted: acceptedCount,
      finished: finishedCount,
      declined: declinedCount,
      expired: expiredCount,
    });
  } catch (error) {
    console.error("Error fetching student LoR stats:", error);
    return res
      .status(500)
      .json({ message: "Server error while fetching student stats." });
  }
};

/**
 * Stats for a teacher (pending, accepted, finished, declined, expired counts)
 */
exports.getTeacherStats = async (req, res) => {
  try {
    const { teacherId } = req.params;
    if (!teacherId) {
      return res.status(400).json({ message: "Teacher ID is required." });
    }

    const pendingCount = await countRequestsByStatusTeacher(
      teacherId,
      "PENDING"
    );
    const acceptedCount = await countRequestsByStatusTeacher(
      teacherId,
      "ACCEPTED"
    );
    const finishedCount = await countRequestsByStatusTeacher(
      teacherId,
      "FINISHED"
    );
    const declinedCount = await countRequestsByStatusTeacher(
      teacherId,
      "DECLINED"
    );
    const expiredCount = await countRequestsByStatusTeacher(
      teacherId,
      "EXPIRED"
    );

    return res.json({
      pending: pendingCount,
      accepted: acceptedCount,
      finished: finishedCount,
      declined: declinedCount,
      expired: expiredCount,
    });
  } catch (error) {
    console.error("Error fetching teacher LoR stats:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching teacher stats." });
  }
};

/**
 * Return an array of teacher IDs that the student has had requests declined with
 */
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

/**
 * Store university data for admin analysis
 */

exports.trackUniversitiesStudentApplied = async (req, res) => {
  try {
    const { student_id, universities } = req.body;
    // console.log(student_id, universities);

    if (!student_id || !Array.isArray(universities)) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Fetch student details and extract only required fields
    const student = await findUserById(student_id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const { department, school, campus } = student || {}; // Ignoring extra fields

    // Prepare data for tracking, selecting only 'name' and 'country'
    const trackingData = universities
      .map(({ name, country }) => ({
        student_id,
        department,
        school,
        campus,
        university_name: name,
        university_country: country,
      }))
      .filter((entry) => entry.university_name && entry.university_country);
    // console.log(trackingData);
    // Track universities

    // Send each row separately
    for (const data of trackingData) {
      await trackUniversities(data);
    }

    return res
      .status(200)
      .json({ message: "Universities tracked successfully" });
  } catch (err) {
    console.error("Error adding universities to university table:", err);
    return res
      .status(500)
      .json({ message: "Server error while inserting in universities table" });
  }
};
