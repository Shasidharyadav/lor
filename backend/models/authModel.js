const db = require("../config/db"); // Database connection

// Helper function to execute queries
const executeQuery = async (query, params, errorMsg) => {
  try {
    const [rows] = await db.query(query, params);
    return rows;
  } catch (err) {
    console.error(`${errorMsg}:`, err.message);
    throw err;
  }
};

// Create password reset table
const createPasswordResetTable = async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) UNIQUE,
        expires_at BIGINT NOT NULL,
        FOREIGN KEY (email) REFERENCES student_users(gitamEmail) ON DELETE CASCADE
      )
    `);
    console.log("Password reset table created or already exists.");
  } catch (err) {
    console.error("Error creating password_resets table:", err.message);
    throw err;
  }
};

// Insert or update password reset entry
const upsertPasswordReset = async (email, token, expiresAt) => {
  try {
    await executeQuery(
      `
      INSERT INTO password_resets (email, token, expires_at)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE token = ?, expires_at = ?
      `,
      [email, token, expiresAt, token, expiresAt],
      "Error inserting or updating password reset entry"
    );
  } catch (err) {
    throw new Error("Error upserting password reset entry");
  }
};

// Get password reset entry by token
const findPasswordResetByToken = async (token) => {
  try {
    const rows = await executeQuery(
      `SELECT * FROM password_resets WHERE token = ? AND expires_at > ?`,
      [token, Date.now()],
      "Error finding password reset by token"
    );
    return rows[0] || null;
  } catch (err) {
    throw new Error("Error finding password reset by token");
  }
};

// Delete password reset entry by email
const deletePasswordResetByEmail = async (email) => {
  try {
    await executeQuery(
      `DELETE FROM password_resets WHERE email = ?`,
      [email],
      "Error deleting password reset by email"
    );
  } catch (err) {
    throw new Error("Error deleting password reset entry");
  }
};

// Find user by email across all roles (including department_admins)
const findUserByEmail = async (email) => {
  // Added "department_admins" to the roles array.
  const roles = ["student_users", "teacher_users", "admin_users", "department_admins"];
  for (const role of roles) {
    const rows = await executeQuery(
      `SELECT * FROM ${role} WHERE gitamEmail = ?`,
      [email],
      `Error finding user in ${role}`
    );
    if (rows.length > 0) {
      // For department_admins, return a specific role; otherwise use the first part of the table name.
      const userRole = role === "department_admins" ? "department_admin" : role.split("_")[0];
      return { ...rows[0], role: userRole };
    }
  }
  return null;
};

// Update user password by email across all roles (including department_admins)
const updateUserPasswordByEmail = async (email, hashedPassword) => {
  const roles = ["student_users", "teacher_users", "admin_users", "department_admins"];
  for (const role of roles) {
    const result = await executeQuery(
      `UPDATE ${role} SET password = ? WHERE gitamEmail = ?`,
      [hashedPassword, email],
      `Error updating password in ${role}`
    );
    if (result.affectedRows > 0) {
      return true;
    }
  }
  return false;
};

module.exports = {
  createPasswordResetTable,
  upsertPasswordReset,
  findPasswordResetByToken,
  deletePasswordResetByEmail,
  findUserByEmail,
  updateUserPasswordByEmail,
};
