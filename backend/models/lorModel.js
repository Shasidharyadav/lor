const db = require("../config/db");

/**
 * Create lor_requests table if it does not exist
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
        status ENUM('PENDING','APPROVED','DECLINED') DEFAULT 'PENDING',
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
 * Create a new LoR request in lor_requests table
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
 * Update the status of an LoR request
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

  // Check if 'universities' is a string; if so, parse it
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
 * Fetch pending LoR requests for a given teacher_id
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

module.exports = {
  createLorTables,
  createLorRequest,
  getRequestsByTeacher,
  getRequestsByStudent,
  updateLorStatus,
  findLorRequestById,
  getPendingRequestsByTeacher,
  getPendingRequestsByStudent,
  getAcceptedRequestsByTeacher,
  getAcceptedRequestsByStudent,
};
