// models/userModel.js
const db = require("../config/db"); // Your mysql2/promise connection pool

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

// Create tables for users and profiles
const createTables = async () => {
  try {
    // Users Tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS student_users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        gitamEmail VARCHAR(255) NOT NULL UNIQUE,
        personalEmail VARCHAR(255),
        campus VARCHAR(255),
        school VARCHAR(255),
        department VARCHAR(255),
        specialization VARCHAR(255),
        yearOfPassout INT,
        password VARCHAR(255) NOT NULL
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS teacher_users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        gitamEmail VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(15),
        campus VARCHAR(255),
        school VARCHAR(255),
        department VARCHAR(255),
        specialization VARCHAR(255),
        designation VARCHAR(255),
        password VARCHAR(255) NOT NULL
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        gitamEmail VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);

    // Profiles Tables
    await db.query(`
      CREATE TABLE IF NOT EXISTS student_profiles (
        id VARCHAR(255) PRIMARY KEY,
        linkedin VARCHAR(255),
        twitter VARCHAR(255),
        portfolio VARCHAR(255),
        bio TEXT,
        FOREIGN KEY (id) REFERENCES student_users(id) ON DELETE CASCADE
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS faculty_profiles (
        id VARCHAR(255) PRIMARY KEY,
        qualifications TEXT,
        research_interests TEXT,
        bio TEXT,
        FOREIGN KEY (id) REFERENCES teacher_users(id) ON DELETE CASCADE
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS admin_profiles (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        school VARCHAR(255),
        department VARCHAR(255),
        FOREIGN KEY (id) REFERENCES admin_users(id) ON DELETE CASCADE
      )
    `);

    console.log("All tables created or already exist");
  } catch (err) {
    console.error("Error creating tables:", err.message);
    throw err;
  }
};

// User Operations
const createStudent = async (studentData) => {
  const {
    id,
    name,
    gitamEmail,
    personalEmail,
    campus,
    school,
    department,
    specialization,
    yearOfPassout,
    password,
  } = studentData;
  await executeQuery(
    `
    INSERT INTO student_users (id, name, gitamEmail, personalEmail, campus, school, department, specialization, yearOfPassout, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      name,
      gitamEmail,
      personalEmail,
      campus,
      school,
      department,
      specialization,
      yearOfPassout,
      password,
    ],
    "Error creating student user"
  );
};

const createTeacher = async (teacherData) => {
  const {
    id,
    name,
    gitamEmail,
    phone,
    campus,
    school,
    department,
    specialization,
    designation,
    password,
  } = teacherData;
  await executeQuery(
    `
    INSERT INTO teacher_users (id, name, gitamEmail, phone, campus, school, department, specialization, designation, password)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      name,
      gitamEmail,
      phone,
      campus,
      school,
      department,
      specialization,
      designation,
      password,
    ],
    "Error creating teacher user"
  );
};

const createAdmin = async (adminData) => {
  const { id, name, gitamEmail, password } = adminData;
  await executeQuery(
    `
    INSERT INTO admin_users (id, name, gitamEmail, password)
    VALUES (?, ?, ?, ?)
    `,
    [id, name, gitamEmail, password],
    "Error creating admin user"
  );
};

// Profile Operations
const createStudentProfile = async (profileData) => {
  const { id, linkedin, twitter, portfolio, bio } = profileData;
  await executeQuery(
    `
    INSERT INTO student_profiles (id, linkedin, twitter, portfolio, bio)
    VALUES (?, ?, ?, ?, ?)
    `,
    [id, linkedin, twitter, portfolio, bio],
    "Error creating student profile"
  );
};

const createFacultyProfile = async (profileData) => {
  const { id, qualifications, research_interests, bio } = profileData;
  await executeQuery(
    `
    INSERT INTO faculty_profiles (id, qualifications, research_interests, bio)
    VALUES (?, ?, ?, ?)
    `,
    [id, qualifications, research_interests, bio],
    "Error creating faculty profile"
  );
};

const createAdminProfile = async (profileData) => {
  const { id, name, school, department } = profileData;
  await executeQuery(
    `
    INSERT INTO admin_profiles (id, name, school, department)
    VALUES (?, ?, ?, ?)
    `,
    [id, name, school, department],
    "Error creating admin profile"
  );
};

const findUserById = async (id) => {
  const queries = [
    { table: "student_users", role: "student" },
    { table: "teacher_users", role: "teacher" },
    { table: "admin_users", role: "admin" },
  ];

  for (const { table, role } of queries) {
    const rows = await executeQuery(
      `SELECT *, '${role}' AS role FROM ${table} WHERE id = ?`,
      [id],
      `Error fetching user from ${table}`
    );
    if (rows.length > 0) return rows[0];
  }

  return null;
};

const findProfileById = async (id, role) => {
  const tableMap = {
    student: "student_profiles",
    teacher: "faculty_profiles",
    admin: "admin_profiles",
  };
  const tableName = tableMap[role];
  if (!tableName) throw new Error("Invalid role specified");

  return executeQuery(
    `SELECT * FROM ${tableName} WHERE id = ?`,
    [id],
    `Error fetching ${role} profile`
  );
};

// Update User Details
const updateUserDetails = async (id, updates, role) => {
  const tableMap = {
    student: "student_users",
    teacher: "teacher_users",
    admin: "admin_users",
  };

  const tableName = tableMap[role];
  if (!tableName) throw new Error("Invalid role specified");

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(updates), id];

  return executeQuery(
    `UPDATE ${tableName} SET ${fields} WHERE id = ?`,
    values,
    `Error updating ${role} user details`
  );
};

// Update Profile
const updateProfile = async (id, updates, role) => {
  const tableMap = {
    student: "student_profiles",
    teacher: "faculty_profiles",
    admin: "admin_profiles",
  };

  const tableName = tableMap[role];
  if (!tableName) throw new Error("Invalid role specified");

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");
  const values = [...Object.values(updates), id];

  return executeQuery(
    `UPDATE ${tableName} SET ${fields} WHERE id = ?`,
    values,
    `Error updating ${role} profile`
  );
};

// Update Password
const updatePassword = async (id, newPassword, role) => {
  const tableMap = {
    student: "student_users",
    teacher: "teacher_users",
    admin: "admin_users",
  };

  const tableName = tableMap[role];
  if (!tableName) throw new Error("Invalid role specified");

  await executeQuery(
    `UPDATE ${tableName} SET password = ? WHERE id = ?`,
    [newPassword, id],
    `Error updating password for ${role}`
  );
};

// -- NEW FUNCTION: getAllTeacherUsers
//    This will fetch all teacher records, optionally joined with faculty_profiles
const getAllTeacherUsers = async () => {
  return executeQuery(
    `
      SELECT
        t.id,
        t.name,
        t.gitamEmail AS email,
        t.phone,
        t.campus,
        t.school,
        t.department,
        t.specialization,
        t.designation,
        p.qualifications,
        p.research_interests AS researchInterests,
        p.bio
      FROM teacher_users t
      LEFT JOIN faculty_profiles p ON t.id = p.id
      ORDER BY t.name ASC
    `,
    [],
    "Error fetching teacher users with profiles"
  );
};

module.exports = {
  createTables,
  createStudent,
  createTeacher,
  createAdmin,
  createStudentProfile,
  createFacultyProfile,
  createAdminProfile,
  findUserById,
  findProfileById,
  updateUserDetails,
  updateProfile,
  updatePassword,
  getAllTeacherUsers,
  executeQuery, // if you need it elsewhere
};
