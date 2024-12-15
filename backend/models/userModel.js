const db = require('../config/db');

// Create tables
exports.createTables = async () => {
  const studentQuery = `
    CREATE TABLE IF NOT EXISTS student_users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        phone VARCHAR(10) NOT NULL,
        campus ENUM('Hyderabad', 'Bangalore', 'Visakhapatnam') NOT NULL,
        department ENUM('CSE', 'ECE', 'Civil', 'Aero', 'Mech', 'CSE Specializations') NOT NULL,
        password VARCHAR(255) NOT NULL
    )
  `;
  
  const teacherQuery = `
    CREATE TABLE IF NOT EXISTS teacher_users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        designation ENUM('Assistant Professor', 'Associate Professor', 'Professor') NOT NULL,
        department ENUM('CSE', 'ECE', 'Civil', 'Aero', 'Mech', 'CSE Specializations') NOT NULL,
        password VARCHAR(255) NOT NULL
    )
  `;

  const adminQuery = `
    CREATE TABLE IF NOT EXISTS admin_users (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
    )
  `;

  try {
    await db.query(studentQuery);
    await db.query(teacherQuery);
    await db.query(adminQuery);
    console.log('Tables ensured in database');
  } catch (error) {
    console.error('Error creating tables:', error.message);
    throw error;
  }
};

// Insert student
exports.createStudent = async (studentData) => {
  const query = `
    INSERT INTO student_users (id, name, email, phone, campus, department, password)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    studentData.id,
    studentData.name,
    studentData.email,
    studentData.phone,
    studentData.campus,
    studentData.department,
    studentData.password,
  ];
  return db.query(query, values);
};

// Insert teacher
exports.createTeacher = async (teacherData) => {
  const query = `
    INSERT INTO teacher_users (id, name, email, designation, department, password)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    teacherData.id,
    teacherData.name,
    teacherData.email,
    teacherData.designation,
    teacherData.department,
    teacherData.password,
  ];
  return db.query(query, values);
};

// Insert admin
exports.createAdmin = async (adminData) => {
  const query = `
    INSERT INTO admin_users (id, name, email, password)
    VALUES (?, ?, ?, ?)
  `;
  const values = [
    adminData.id,
    adminData.name,
    adminData.email,
    adminData.password,
  ];
  return db.query(query, values);
};
