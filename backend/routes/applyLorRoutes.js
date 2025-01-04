const express = require('express');
const router = express.Router();
const db = require('../config/db'); // your MySQL2/promise connection pool

/**
 * GET /api/apply-lor/metadata
 * Fetches campus, school, department, specialization, plus all faculty details
 * from teacher_users table.
 */
router.get('/metadata', async (req, res) => {
  try {
    // 1) Fetch DISTINCT campus, school, department, specialization
    // These queries assume that each column in teacher_users
    // might have duplicates for different faculty. 
    // We want a unique set of each to populate dropdowns.

    // a) Distinct campuses
    const [campusRows] = await db.query(`
      SELECT DISTINCT campus 
      FROM teacher_users
      WHERE campus IS NOT NULL AND campus != ''
      ORDER BY campus ASC
    `);

    // b) Distinct schools
    const [schoolRows] = await db.query(`
      SELECT DISTINCT school
      FROM teacher_users
      WHERE school IS NOT NULL AND school != ''
      ORDER BY school ASC
    `);

    // c) Distinct departments
    const [departmentRows] = await db.query(`
      SELECT DISTINCT department
      FROM teacher_users
      WHERE department IS NOT NULL AND department != ''
      ORDER BY department ASC
    `);

    // d) Distinct specializations
    const [specializationRows] = await db.query(`
      SELECT DISTINCT specialization
      FROM teacher_users
      WHERE specialization IS NOT NULL AND specialization != ''
      ORDER BY specialization ASC
    `);

    // 2) Get full faculty details if needed 
    //    (i.e., all rows from teacher_users)
    const [facultyRows] = await db.query(`
      SELECT
        id,
        name,
        gitamEmail,
        phone,
        campus,
        school,
        department,
        specialization,
        designation
      FROM teacher_users
      ORDER BY name ASC
    `);

    // 3) Transform row data into arrays
    const campuses = campusRows.map((row) => row.campus);
    const schools = schoolRows.map((row) => row.school);
    const departments = departmentRows.map((row) => row.department);
    const specializations = specializationRows.map((row) => row.specialization);

    // 4) Prepare final JSON response
    res.json({
      campuses,
      schools,
      departments,
      specializations,
      facultyList: facultyRows,
    });
  } catch (err) {
    console.error('Error fetching apply-lor metadata:', err);
    res.status(500).json({ message: 'Server error retrieving data' });
  }
});

module.exports = router;
