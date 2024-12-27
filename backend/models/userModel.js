const db = require('../config/db'); // Import your database connection

// Create tables for students, teachers, and admins
const createTables = async () => {
  try {
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

    console.log('All tables created or already exist');
  } catch (err) {
    console.error('Error creating tables:', err.message);
    throw err;
  }
};

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

// Create a new student user
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
    'Error creating student user'
  );
};

// Create a new teacher user
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
    'Error creating teacher user'
  );
};

// Create a new admin user
const createAdmin = async (adminData) => {
  const { id, name, gitamEmail, password } = adminData;

  await executeQuery(
    `
    INSERT INTO admin_users (id, name, gitamEmail, password)
    VALUES (?, ?, ?, ?)
  `,
    [id, name, gitamEmail, password],
    'Error creating admin user'
  );
};

// Find user by ID
const findUserById = async (id) => {
  try {
    // Check in student_users
    const studentRows = await executeQuery(
      `SELECT * FROM student_users WHERE id = ?`,
      [id],
      'Error fetching student user by ID'
    );
    if (studentRows.length > 0) {
      return { ...studentRows[0], role: 'student' };
    }

    // Check in teacher_users
    const teacherRows = await executeQuery(
      `SELECT * FROM teacher_users WHERE id = ?`,
      [id],
      'Error fetching teacher user by ID'
    );
    if (teacherRows.length > 0) {
      return { ...teacherRows[0], role: 'teacher' };
    }

    // Check in admin_users
    const adminRows = await executeQuery(
      `SELECT * FROM admin_users WHERE id = ?`,
      [id],
      'Error fetching admin user by ID'
    );
    if (adminRows.length > 0) {
      return { ...adminRows[0], role: 'admin' };
    }

    // If not found, return null
    return null;
  } catch (err) {
    console.error('Error finding user by ID:', err.message);
    throw err;
  }
};

// Update user details
const updateUserDetails = async (id, updates, role) => {
  let tableName;
  if (role === 'student') tableName = 'student_users';
  else if (role === 'teacher') tableName = 'teacher_users';
  else if (role === 'admin') tableName = 'admin_users';
  else throw new Error('Invalid role provided');

  const fields = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(', ');
  const values = [...Object.values(updates), id];

  await executeQuery(
    `UPDATE ${tableName} SET ${fields} WHERE id = ?`,
    values,
    `Error updating ${role} user details`
  );
};

// Update user password
const updatePassword = async (id, password, role) => {
  let tableName;
  if (role === 'student') tableName = 'student_users';
  else if (role === 'teacher') tableName = 'teacher_users';
  else if (role === 'admin') tableName = 'admin_users';
  else throw new Error('Invalid role provided');

  await executeQuery(
    `UPDATE ${tableName} SET password = ? WHERE id = ?`,
    [password, id],
    `Error updating password for ${role} user`
  );
};

module.exports = {
  createTables,
  createStudent,
  createTeacher,
  createAdmin,
  findUserById,
  updateUserDetails,
  updatePassword,
};
