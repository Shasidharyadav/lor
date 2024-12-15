const db = require('../config/db');

// Create LoR Requests Table
exports.createLoRTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS lor_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id INT NOT NULL,
      faculty_id INT NOT NULL,
      reason TEXT NOT NULL,
      status ENUM('Pending', 'Accepted', 'Rejected') DEFAULT 'Pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id),
      FOREIGN KEY (faculty_id) REFERENCES users(id)
    )
  `;
  await db.query(query);
};

// Get LoR Requests by Role
exports.getLoRsByRole = async (role) => {
  const [rows] = await db.query(`
    SELECT lr.id, lr.reason, lr.status, u.username AS student
    FROM lor_requests lr
    JOIN users u ON lr.student_id = u.id
    WHERE u.role = ?
  `, [role]);
  return rows;
};

// Submit New LoR
exports.submitLoR = async (studentId, facultyId, reason) => {
  const query = 'INSERT INTO lor_requests (student_id, faculty_id, reason, status) VALUES (?, ?, ?, ?)';
  await db.query(query, [studentId, facultyId, reason, 'Pending']);
};

// Update LoR Status
exports.updateLoRStatus = async (id, status) => {
  const query = 'UPDATE lor_requests SET status = ? WHERE id = ?';
  await db.query(query, [status, id]);
};
