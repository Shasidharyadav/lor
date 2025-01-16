// models/lorModel.js

const db = require("../config/db");

/**
 * Create the lor_requests table if it does not exist.
 * This includes columns for final LOR details (name_address, etc.)
 * and an ENUM for status with 'FINISHED' and 'EXPIRED'.
 */
async function createLorTables() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS lor_requests (
        request_id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id VARCHAR(255) NOT NULL,
        student_id VARCHAR(255) NOT NULL,

        campus VARCHAR(255),
        school VARCHAR(255),
        department VARCHAR(255),
        specialization VARCHAR(255),

        lor_content TEXT,
        universities JSON,

        /* Updated ENUM to include FINISHED and EXPIRED */
        status ENUM('PENDING','APPROVED','DECLINED','FINISHED','EXPIRED') DEFAULT 'PENDING',

        /* Columns to store final letter details from teacher */
        name_address VARCHAR(255),
        name_signature VARCHAR(255),
        teacher_designation VARCHAR(255),
        teacher_department VARCHAR(255),
        teacher_campus VARCHAR(255),
        teacher_email VARCHAR(255),
        teacher_phone VARCHAR(50),

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

        FOREIGN KEY (teacher_id) REFERENCES teacher_users(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES student_users(id) ON DELETE CASCADE
      )
    `);

    console.log("lor_requests table created or already exists");
  } catch (err) {
    console.error("Error creating lor_requests table:", err.message);
    throw err;
  }
}

/**
 * Create a new LoR request in the lor_requests table
 */
async function createLorRequest(data) {
  const {
    teacher_id,
    student_id,
    campus,
    school,
    department,
    specialization,
    lor_content,
    universities,
  } = data;

  // Convert 'universities' array/object to JSON if present
  const univJson = JSON.stringify(universities || []);

  const sql = `
    INSERT INTO lor_requests (
      teacher_id,
      student_id,
      campus,
      school,
      department,
      specialization,
      lor_content,
      universities
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [
    teacher_id,
    student_id,
    campus,
    school,
    department,
    specialization,
    lor_content,
    univJson,
  ]);

  return result.insertId; // Return the newly created request_id
}

/**
 * Fetch all LoR requests for a given teacher_id
 */
async function getRequestsByTeacher(teacherId) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM lor_requests
    WHERE teacher_id = ?
    ORDER BY created_at DESC
  `,
    [teacherId]
  );
  return rows;
}

/**
 * Fetch all LoR requests for a given student_id
 */
async function getRequestsByStudent(studentId) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM lor_requests
    WHERE student_id = ?
    ORDER BY created_at DESC
  `,
    [studentId]
  );
  return rows;
}

/**
 * Update the status of a LoR request (APPROVED, DECLINED, EXPIRED, etc.)
 */
async function updateLorStatus(requestId, newStatus) {
  const sql = `
    UPDATE lor_requests
    SET status = ?
    WHERE request_id = ?
  `;
  await db.query(sql, [newStatus, requestId]);
}

/**
 * Find a LoR request by its ID
 */
async function findLorRequestById(requestId) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM lor_requests
    WHERE request_id = ?
    LIMIT 1
  `,
    [requestId]
  );

  if (rows.length === 0) return null;

  const lorRequest = rows[0];

  // Parse 'universities' if stored as JSON string
  if (lorRequest.universities && typeof lorRequest.universities === "string") {
    try {
      lorRequest.universities = JSON.parse(lorRequest.universities);
    } catch (err) {
      console.error("Error parsing universities:", err);
      lorRequest.universities = [];
    }
  }

  return lorRequest;
}

/**
 * Fetch pending LoR requests for a specific teacher (status = 'PENDING')
 */
async function getPendingRequestsByTeacher(teacherId) {
  const [rows] = await db.query(
    `
    SELECT 
      lr.request_id,
      lr.status,
      lr.lor_content,
      su.name AS student_name
    FROM lor_requests lr
    JOIN student_users su ON lr.student_id = su.id
    WHERE lr.teacher_id = ? AND lr.status = 'PENDING'
    ORDER BY lr.created_at DESC
  `,
    [teacherId]
  );

  return rows;
}

/**
 * Fetch pending LoR requests for a specific student (status = 'PENDING')
 */
async function getPendingRequestsByStudent(studentId) {
  const [rows] = await db.query(
    `
    SELECT 
      lr.request_id,
      lr.status,
      lr.lor_content,
      tu.name AS teacher_name
    FROM lor_requests lr
    JOIN teacher_users tu ON lr.teacher_id = tu.id
    WHERE lr.student_id = ? AND lr.status = 'PENDING'
    ORDER BY lr.created_at DESC
  `,
    [studentId]
  );
  return rows;
}

/**
 * Fetch accepted (APPROVED) LoR requests for a teacher
 */
async function getAcceptedRequestsByTeacher(teacherId) {
  const [rows] = await db.query(
    `
    SELECT 
      lr.request_id,
      lr.status,
      lr.lor_content,
      su.name AS student_name
    FROM lor_requests lr
    JOIN student_users su ON lr.student_id = su.id
    WHERE lr.teacher_id = ? AND lr.status = 'APPROVED'
    ORDER BY lr.created_at DESC
  `,
    [teacherId]
  );
  return rows;
}

/**
 * Fetch accepted (APPROVED) LoR requests for a student
 */
async function getAcceptedRequestsByStudent(studentId) {
  const [rows] = await db.query(
    `
    SELECT 
      lr.request_id,
      lr.status,
      lr.lor_content,
      tu.name AS teacher_name
    FROM lor_requests lr
    JOIN teacher_users tu ON lr.teacher_id = tu.id
    WHERE lr.student_id = ? AND lr.status = 'APPROVED'
    ORDER BY lr.created_at DESC
  `,
    [studentId]
  );
  return rows;
}

/**
 * FINALIZE an LoR request:
 *  - Store final letter details (teacher signature, email, etc.)
 *  - Set status to 'FINISHED'
 */
async function finalizeLorRequest(
  requestId,
  {
    lor_content,
    name_address,
    name_signature,
    teacher_designation,
    teacher_department,
    teacher_campus,
    teacher_email,
    teacher_phone,
  }
) {
  const sql = `
    UPDATE lor_requests
    SET
      lor_content = ?,
      name_address = ?,
      name_signature = ?,
      teacher_designation = ?,
      teacher_department = ?,
      teacher_campus = ?,
      teacher_email = ?,
      teacher_phone = ?,
      status = 'FINISHED'
    WHERE request_id = ?
  `;

  // If any fields are missing, we set them to null to avoid MySQL errors
  await db.query(sql, [
    lor_content || null,
    name_address || null,
    name_signature || null,
    teacher_designation || null,
    teacher_department || null,
    teacher_campus || null,
    teacher_email || null,
    teacher_phone || null,
    requestId,
  ]);
}
async function countRequestsByStatusStudent(studentId, status) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count FROM lor_requests WHERE student_id = ? AND status = ?`,
    [studentId, status]
  );
  return rows[0].count || 0;
}
async function countRequestsByStatusTeacher(teacherId, status) {
  const [rows] = await db.query(
    `
      SELECT COUNT(*) as count
      FROM lor_requests
      WHERE teacher_id = ? AND status = ?
    `,
    [teacherId, status]
  );
  return rows[0].count || 0;
}
async function findDeclinedTeachersByStudent(studentId) {
  const [rows] = await db.query(
    `
      SELECT DISTINCT teacher_id
      FROM lor_requests
      WHERE student_id = ?
        AND status = 'DECLINED'
    `,
    [studentId]
  );
  // rows might look like [ { teacher_id: 'TEACHER1' }, { teacher_id: 'TEACHER2' } ]

  // Map to a simple array of teacher IDs
  return rows.map((row) => row.teacher_id);
}

module.exports = {
  // Table creation
  createLorTables,

  // Create
  createLorRequest,

  // Read
  getRequestsByTeacher,
  getRequestsByStudent,
  findLorRequestById,

  // Update
  updateLorStatus,
  finalizeLorRequest,

  // Helper fetches for statuses
  getPendingRequestsByTeacher,
  getPendingRequestsByStudent,
  getAcceptedRequestsByTeacher,
  getAcceptedRequestsByStudent,
  countRequestsByStatusStudent,
  countRequestsByStatusTeacher,
  findDeclinedTeachersByStudent,
};
