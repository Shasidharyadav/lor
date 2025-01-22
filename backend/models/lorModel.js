// models/lorModel.js

const db = require("../config/db");

/**
 * Create the lor_requests table if it does not exist.
 * Includes 'title' and 'deadline' columns, plus relationships.
 */
async function createLorTables() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS lor_requests (
        request_id INT AUTO_INCREMENT PRIMARY KEY,
        teacher_id VARCHAR(255) NOT NULL,
        student_id VARCHAR(255) NOT NULL,

        title VARCHAR(50),  -- e.g. Mr, Ms, etc.

        campus VARCHAR(255),
        school VARCHAR(255),
        department VARCHAR(255),
        specialization VARCHAR(255),

        lor_content TEXT,
        universities JSON,

        deadline DATE,      -- At least 7 days from now (frontend ensures)

        status ENUM('PENDING','APPROVED','DECLINED','FINISHED','EXPIRED') DEFAULT 'PENDING',

        -- Final letter details from teacher
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

    console.log("lor_requests table created (or already exists).");
  } catch (err) {
    console.error("Error creating lor_requests table:", err.message);
    throw err;
  }
}

/**
 * Create a new LoR request
 * (Includes 'title' and 'deadline' if provided)
 */
async function createLorRequest(data) {
  const {
    teacher_id,
    student_id,
    title,
    campus,
    school,
    department,
    specialization,
    lor_content,
    universities,
    deadline
  } = data;

  // Convert universities array to JSON
  const univJson = JSON.stringify(universities || []);

  const sql = `
    INSERT INTO lor_requests (
      teacher_id,
      student_id,
      title,
      campus,
      school,
      department,
      specialization,
      lor_content,
      universities,
      deadline
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await db.query(sql, [
    teacher_id,
    student_id,
    title || null,
    campus,
    school,
    department,
    specialization,
    lor_content,
    univJson,
    deadline || null
  ]);

  return result.insertId; // newly created request_id
}

/**
 * Fetch ALL LoR requests for a given teacher_id
 * Now includes 'student_name' by joining student_users.
 */
async function getRequestsByTeacher(teacherId) {
  const [rows] = await db.query(
    `
    SELECT
      lr.*,
      su.name AS student_name
    FROM lor_requests lr
    JOIN student_users su ON lr.student_id = su.id
    WHERE lr.teacher_id = ?
    ORDER BY lr.created_at DESC
  `,
    [teacherId]
  );

  // Parse universities from JSON
  rows.forEach((row) => {
    if (typeof row.universities === 'string') {
      try {
        row.universities = JSON.parse(row.universities);
      } catch (err) {
        row.universities = [];
      }
    }
  });

  return rows;
}

/**
 * Fetch ALL LoR requests for a given student_id
 * Now includes 'teacher_name' by joining teacher_users.
 */
async function getRequestsByStudent(studentId) {
  const [rows] = await db.query(
    `
    SELECT
      lr.*,
      tu.name AS teacher_name
    FROM lor_requests lr
    JOIN teacher_users tu ON lr.teacher_id = tu.id
    WHERE lr.student_id = ?
    ORDER BY lr.created_at DESC
  `,
    [studentId]
  );

  // Parse universities from JSON
  rows.forEach((row) => {
    if (typeof row.universities === 'string') {
      try {
        row.universities = JSON.parse(row.universities);
      } catch (err) {
        row.universities = [];
      }
    }
  });

  return rows;
}

/**
 * Update the status of a request (APPROVED, DECLINED, EXPIRED, etc.)
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
 * Find a request by ID (returns everything).
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
  // parse universities
  if (lorRequest.universities && typeof lorRequest.universities === 'string') {
    try {
      lorRequest.universities = JSON.parse(lorRequest.universities);
    } catch (err) {
      lorRequest.universities = [];
    }
  }

  return lorRequest;
}

/**
 * Fetch PENDING requests for a teacher, joined with student_users for 'student_name'.
 */
async function getPendingRequestsByTeacher(teacherId) {
  const [rows] = await db.query(
    `
    SELECT
      lr.request_id,
      lr.status,
      lr.lor_content,
      lr.deadline,
      su.name AS student_name
    FROM lor_requests lr
    JOIN student_users su ON lr.student_id = su.id
    WHERE lr.teacher_id = ?
      AND lr.status = 'PENDING'
    ORDER BY lr.created_at DESC
  `,
    [teacherId]
  );

  return rows;
}

/**
 * Fetch PENDING requests for a student, joined with teacher_users for 'teacher_name'.
 */
async function getPendingRequestsByStudent(studentId) {
  const [rows] = await db.query(
    `
    SELECT
      lr.request_id,
      lr.status,
      lr.lor_content,
      lr.deadline,
      tu.name AS teacher_name
    FROM lor_requests lr
    JOIN teacher_users tu ON lr.teacher_id = tu.id
    WHERE lr.student_id = ?
      AND lr.status = 'PENDING'
    ORDER BY lr.created_at DESC
  `,
    [studentId]
  );

  return rows;
}

/**
 * Fetch ACCEPTED (APPROVED/FINISHED/EXPIRED) requests for a teacher
 * joined with student_users for 'student_name'.
 */
async function getAcceptedRequestsByTeacher(teacherId) {
  const [rows] = await db.query(
    `
    SELECT
      lr.request_id,
      lr.status,
      lr.lor_content,
      lr.deadline,
      su.name AS student_name
    FROM lor_requests lr
    JOIN student_users su ON lr.student_id = su.id
    WHERE lr.teacher_id = ?
      AND lr.status IN ('APPROVED', 'FINISHED', 'EXPIRED')
    ORDER BY lr.created_at DESC
  `,
    [teacherId]
  );
  return rows;
}

/**
 * Fetch ACCEPTED (APPROVED/FINISHED/EXPIRED) requests for a student
 * joined with teacher_users for 'teacher_name'.
 */
async function getAcceptedRequestsByStudent(studentId) {
  const [rows] = await db.query(
    `
    SELECT
      lr.request_id,
      lr.status,
      lr.lor_content,
      lr.deadline,
      tu.name AS teacher_name
    FROM lor_requests lr
    JOIN teacher_users tu ON lr.teacher_id = tu.id
    WHERE lr.student_id = ?
      AND lr.status IN ('APPROVED', 'FINISHED', 'EXPIRED')
    ORDER BY lr.created_at DESC
  `,
    [studentId]
  );
  return rows;
}

/**
 * FINALIZE an LoR request:
 * store final letter details, set status to 'FINISHED'.
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

/**
 * Count how many requests a student has by status
 */
async function countRequestsByStatusStudent(studentId, status) {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS count FROM lor_requests WHERE student_id = ? AND status = ?`,
    [studentId, status]
  );
  return rows[0].count || 0;
}

/**
 * Count how many requests a teacher has by status
 */
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

/**
 * Return an array of teacher IDs that have been declined by a given student
 */
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

  // Additional queries
  getPendingRequestsByTeacher,
  getPendingRequestsByStudent,
  getAcceptedRequestsByTeacher,
  getAcceptedRequestsByStudent,
  countRequestsByStatusStudent,
  countRequestsByStatusTeacher,
  findDeclinedTeachersByStudent,
};
