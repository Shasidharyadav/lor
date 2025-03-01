/********************************************************
 * adminController.js
 * All admin-specific logic for:
 *   - Dashboard stats
 *   - Listing/filtering Students, Faculty, All Users
 *   - Deleting users
 *   - Generating/fetching reports
 *   - Updating teacher status (HOD/HOI/teacher)
 *   - Analysis queries (facultyCountByDepartment, top10Universities, etc.)
 ********************************************************/
const userModel = require("../models/userModel"); // your DB abstractionr
const bcrypt = require("bcryptjs");
const {
  createDepartmentAdmin: createDepartmentAdmin,
  checkAlreadyExistenceInDeptAdmin: checkAlreadyExistenceInDeptAdmin,
} = require("../models/userModel");

// If using them here directly, import the middleware (though typically used in routes):
// const { authenticate, authorize } = require('../middleware/authMiddleware');

/**
 * PATCH /api/admin/teacher/:id/status
 * Admin changes a teacher's status: "teacher" -> "HOD" or "HOI"
 */
exports.updateTeacherStatus = async (req, res) => {
  const { id } = req.params; // Teacher's ID
  const { status } = req.body; // new status: 'teacher', 'HOD', or 'HOI'

  // Validate the requested status
  if (!["teacher", "HOD", "HOI"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status. Must be teacher, HOD, or HOI.",
    });
  }

  try {
    // Check if the teacher exists
    const [teacher] = await userModel.executeQuery(
      "SELECT * FROM teacher_users WHERE id = ?",
      [id],
      "Error fetching teacher"
    );
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found." });
    }

    // Update the teacher's status
    await userModel.executeQuery(
      "UPDATE teacher_users SET status = ? WHERE id = ?",
      [status, id],
      `Error updating teacher ${id} status`
    );

    res.json({
      message: `Teacher ${id} status updated to ${status} successfully.`,
    });
  } catch (err) {
    console.error("Error in updateTeacherStatus:", err);
    res.status(500).json({ message: "Failed to update teacher status." });
  }
};

/**
 * GET /api/admin/dashboard-stats
 * Returns high-level stats for Admin Dashboard:
 *   - # of students, # of faculty, # of admins, total
 *   - Additional distributions (campus, branch, etc.)
 */
exports.getDashboardStats = async (req, res) => {
  try {
    // 1) Count from each table
    const [studentCount] = await userModel.executeQuery(
      "SELECT COUNT(*) AS count FROM student_users",
      [],
      "Error fetching student count"
    );
    const [teacherCount] = await userModel.executeQuery(
      "SELECT COUNT(*) AS count FROM teacher_users",
      [],
      "Error fetching teacher count"
    );
    const [adminCount] = await userModel.executeQuery(
      "SELECT COUNT(*) AS count FROM admin_users",
      [],
      "Error fetching admin count"
    );

    const stats = {
      students: studentCount.count,
      teachers: teacherCount.count,
      admins: adminCount.count,
      totalUsers: studentCount.count + teacherCount.count + adminCount.count,
    };

    // ----------------------------------------------------
    // 2) Campus Distribution
    // ----------------------------------------------------
    const studentCampusRows = await userModel.executeQuery(
      `SELECT campus, COUNT(*) AS studentCount
       FROM student_users
       GROUP BY campus`,
      [],
      "Error fetching student campus distribution"
    );

    const teacherCampusRows = await userModel.executeQuery(
      `SELECT campus, COUNT(*) AS teacherCount
       FROM teacher_users
       GROUP BY campus`,
      [],
      "Error fetching teacher campus distribution"
    );

    const campusMap = {};

    const setCampusData = (campusName, roleKey, value) => {
      if (!campusMap[campusName]) {
        campusMap[campusName] = {
          campus: campusName,
          students: 0,
          faculty: 0,
          admins: 0,
        };
      }
      campusMap[campusName][roleKey] = value;
    };

    studentCampusRows.forEach((row) => {
      setCampusData(row.campus || "Unknown", "students", row.studentCount);
    });

    teacherCampusRows.forEach((row) => {
      setCampusData(row.campus || "Unknown", "faculty", row.teacherCount);
    });

    const campusDistribution = Object.values(campusMap);

    // ----------------------------------------------------
    // 3) Department (Branch) Distribution
    // ----------------------------------------------------
    const studentBranchRows = await userModel.executeQuery(
      `SELECT department AS branch, COUNT(*) AS studentCount
       FROM student_users
       GROUP BY department`,
      [],
      "Error fetching student branch distribution"
    );

    const teacherBranchRows = await userModel.executeQuery(
      `SELECT department AS branch, COUNT(*) AS teacherCount
       FROM teacher_users
       GROUP BY department`,
      [],
      "Error fetching teacher branch distribution"
    );

    const branchMap = {};

    const setBranchData = (branchName, roleKey, value) => {
      if (!branchMap[branchName]) {
        branchMap[branchName] = {
          branch: branchName,
          students: 0,
          faculty: 0,
        };
      }
      branchMap[branchName][roleKey] = value;
    };

    studentBranchRows.forEach((row) => {
      setBranchData(row.branch || "Unknown", "students", row.studentCount);
    });

    teacherBranchRows.forEach((row) => {
      setBranchData(row.branch || "Unknown", "faculty", row.teacherCount);
    });

    const branchDistribution = Object.values(branchMap);

    // ----------------------------------------------------
    // 4) Return everything in the response
    // ----------------------------------------------------
    res.json({
      stats,
      campusDistribution,
      branchDistribution,
      message: "Admin dashboard stats fetched successfully",
    });
  } catch (error) {
    console.error("Error in getDashboardStats:", error);
    res.status(500).json({ message: "Failed to fetch admin dashboard stats" });
  }
};

/**
 * GET /api/admin/students
 * Fetch all students from 'student_users' table with optional filters:
 *   ?campus=...  &school=...  &department=...  &specialization=...
 */
exports.getAllStudents = async (req, res) => {
  const { campus, school, department, specialization } = req.query;

  let sql = "SELECT * FROM student_users WHERE 1=1";
  const params = [];

  if (campus) {
    sql += " AND campus = ?";
    params.push(campus);
  }
  if (school) {
    sql += " AND school = ?";
    params.push(school);
  }
  if (department) {
    sql += " AND department = ?";
    params.push(department);
  }
  if (specialization) {
    sql += " AND specialization = ?";
    params.push(specialization);
  }

  try {
    const rows = await userModel.executeQuery(
      sql,
      params,
      "Error fetching filtered students"
    );
    res.json({ students: rows });
  } catch (error) {
    console.error("Error in getAllStudents:", error);
    res.status(500).json({ message: "Failed to fetch students" });
  }
};

/**
 * GET /api/admin/faculty
 * Fetch all faculty from 'teacher_users' table with optional filters:
 *   ?campus=... &school=... &department=... &specialization=...
 * Includes "status" field (teacher/HOD/HOI).
 */
exports.getAllFaculty = async (req, res) => {
  const { campus, school, department, specialization } = req.query;

  let sql = `
    SELECT 
      id, 
      name, 
      gitamEmail, 
      campus, 
      school, 
      department, 
      specialization,
      designation, 
      status
    FROM teacher_users
    WHERE 1=1
  `;
  const params = [];

  if (campus) {
    sql += " AND campus = ?";
    params.push(campus);
  }
  if (school) {
    sql += " AND school = ?";
    params.push(school);
  }
  if (department) {
    sql += " AND department = ?";
    params.push(department);
  }
  if (specialization) {
    sql += " AND specialization = ?";
    params.push(specialization);
  }

  try {
    const rows = await userModel.executeQuery(
      sql,
      params,
      "Error fetching filtered faculty"
    );
    res.json({ faculty: rows });
  } catch (error) {
    console.error("Error in getAllFaculty:", error);
    res.status(500).json({ message: "Failed to fetch faculty" });
  }
};

/**
 * GET /api/admin/users
 * Fetch all users from all three tables (students, teachers, admins).
 * Optionally filter by role=? (student | teacher | admin).
 */
exports.getAllUsers = async (req, res) => {
  const { role } = req.query;

  try {
    let users = [];

    if (!role) {
      // Fetch from all three tables
      const studentRows = await userModel.executeQuery(
        'SELECT id, name, gitamEmail, "student" AS role FROM student_users',
        [],
        "Error fetching students"
      );
      const teacherRows = await userModel.executeQuery(
        'SELECT id, name, gitamEmail, "teacher" AS role FROM teacher_users',
        [],
        "Error fetching teachers"
      );
      const adminRows = await userModel.executeQuery(
        'SELECT id, name, gitamEmail, "admin" AS role FROM admin_users',
        [],
        "Error fetching admins"
      );
      users = [...studentRows, ...teacherRows, ...adminRows];
    } else {
      // Filter by role
      if (role === "student") {
        users = await userModel.executeQuery(
          'SELECT id, name, gitamEmail, "student" AS role FROM student_users',
          [],
          "Error fetching students"
        );
      } else if (role === "teacher") {
        users = await userModel.executeQuery(
          'SELECT id, name, gitamEmail, "teacher" AS role FROM teacher_users',
          [],
          "Error fetching teachers"
        );
      } else if (role === "admin") {
        users = await userModel.executeQuery(
          'SELECT id, name, gitamEmail, "admin" AS role FROM admin_users',
          [],
          "Error fetching admins"
        );
      } else {
        // Invalid role => return empty
        return res.json({ users: [] });
      }
    }

    res.json({ users });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * DELETE /api/admin/users/:id
 * Deletes a user by ID from whichever table they are in
 * (student_users, teacher_users, or admin_users).
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // 1) We can see if ID exists in any table
    //    userModel.findUserById might check all 3 tables or do a custom check
    const user = await userModel.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let tableName;
    switch (user.role) {
      case "student":
        tableName = "student_users";
        break;
      case "teacher":
        tableName = "teacher_users";
        break;
      case "admin":
        tableName = "admin_users";
        break;
      default:
        return res.status(400).json({ message: "Invalid user role" });
    }

    // 2) Delete from the identified table
    await userModel.executeQuery(
      `DELETE FROM ${tableName} WHERE id = ?`,
      [id],
      `Error deleting user ${id}`
    );

    res.json({ message: `User ${id} deleted successfully from ${tableName}` });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Failed to delete user" });
  }
};

/**
 * GET /api/admin/requests
 * Admin can fetch LOR requests by ID, student, or teacher
 */
exports.getRequestsForAdmin = async (req, res) => {
  const { request_id, student_id, teacher_id } = req.query;
  let sql = "SELECT * FROM lor_requests WHERE 1=1";
  const params = [];

  if (request_id) {
    sql += " AND request_id = ?";
    params.push(request_id);
  }
  if (student_id) {
    sql += " AND student_id = ?";
    params.push(student_id);
  }
  if (teacher_id) {
    sql += " AND teacher_id = ?";
    params.push(teacher_id);
  }

  try {
    const rows = await userModel.executeQuery(
      sql,
      params,
      "Error fetching records"
    );
    res.json({ requests: rows });
  } catch (error) {
    console.error("Error in fetching records:", error);
    res.status(500).json({ message: "Failed to fetch records" });
  }
};

/**
 * DELETE /api/admin/delete-lor-request/:request_id
 * Deletes a LoR request by ID.
 */
exports.deleteRequestByAdmin = async (req, res) => {
  const { request_id } = req.params;
  let sql = "DELETE FROM lor_requests WHERE request_id = ?";

  try {
    const result = await userModel.executeQuery(
      sql,
      [request_id],
      "Error deleting request"
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Request not found" });
    }
    res.json({ message: "Request deleted successfully" });
  } catch (error) {
    console.error("Error deleting request:", error);
    res.status(500).json({ message: "Failed to delete request" });
  }
};

/**
 * GET /api/admin/reports
 * Returns a list of available reports or placeholders
 */
exports.getReports = async (req, res) => {
  try {
    // This could be dynamic from DB, but let's mock it:
    const reports = [
      { id: 1, title: "Monthly Users Report" },
      { id: 2, title: "Active vs. Inactive Users" },
      { id: 3, title: "Student/Teacher Distribution" },
    ];
    res.json(reports);
  } catch (error) {
    console.error("Error in getReports:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

/**
 * GET /api/admin/export-reports
 * Generate and export a CSV/Excel for custom reports
 */
exports.exportReports = async (req, res) => {
  try {
    const { campus, school, department, specialization, reportId } = req.query;

    // 1) Query your data from DB as needed
    // 2) Generate CSV or Excel (example: CSV):
    const csvHeader = "Campus,School,Department,Specialization,UsersCount\n";
    // We are just faking a "42" row here, you can adapt the real data
    const csvData = [
      `${campus || "All"},${school || "All"},${department || "All"},${
        specialization || "All"
      },42`,
    ].join("\n");
    const csvContent = csvHeader + csvData;

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="report_export.csv"'
    );
    return res.send(csvContent);
  } catch (error) {
    console.error("Error exporting reports:", error);
    return res.status(500).json({ message: "Failed to export reports" });
  }
};

/**
 * GET /api/admin/analysis
 * Example: get data for analysis with filters
 * - facultyCountByDepartment
 * - top10UniversityCountries
 * - top10UniversityNames
 */
exports.getAnalysis = async (req, res) => {
  const { id, school, dept } = req.query;
  try {
    const user = await userModel.findUserById(id);
    //1. Number of distinct students in LOR requests for last 5 years
    if (user.status === "teacher") {
      return;
    }
    let query = `
      SELECT YEAR(lr.created_at) AS year, COUNT(DISTINCT lr.student_id) AS studentCount 
      FROM lor_requests lr 
      JOIN student_users su ON lr.student_id = su.id 
      WHERE YEAR(lr.created_at) > YEAR(CURDATE()) - 5 AND su.campus = ?
    `;
    const params = [];
    params.push(user.campus);

    if (user.status === "HOD") {
      query += " AND su.school = ? AND su.department = ?";
      params.push(user.school);
      params.push(user.department);
    }
    if (school != "") {
      query += " AND su.school = ?";
      params.push(school);
    }
    if (dept != "") {
      query += " AND su.department = ?";
      params.push(dept);
    }

    query += " GROUP BY YEAR(lr.created_at) ORDER BY YEAR(lr.created_at) ASC";

    const resultForFiveYrsStudent = await userModel.executeQuery(
      query,
      params,
      "Errors fetching student data of the past 5 yrs"
    );

    const studentCountForFiveYrs = {};
    resultForFiveYrsStudent.forEach((row) => {
      studentCountForFiveYrs[row.year] = row.studentCount;
    });

    //2. Total students vs students requests
    let doNutStudentsQuery = `WITH campus_students AS (
    SELECT id 
    FROM demo.student_users 
    WHERE campus = ?
    `;

    if (user.status == "HOD") {
      doNutStudentsQuery += " AND school = ? AND department = ?";
    }
    if (school != "") {
      doNutStudentsQuery += " AND school = ?";
    }
    if (dept != "") {
      doNutStudentsQuery += " AND department = ?";
    }

    doNutStudentsQuery += `),
      students_with_requests AS (
      SELECT DISTINCT student_id 
      FROM demo.lor_requests 
      WHERE student_id IN (SELECT id FROM campus_students) AND YEAR(created_at) = YEAR(CURDATE())
      )
      SELECT 
        (SELECT COUNT(*) FROM students_with_requests) AS appliedStudents,
        (SELECT COUNT(*) FROM campus_students) - (SELECT COUNT(*) FROM students_with_requests) AS notAppliedStudents`;

    const resultForDoNutStudents = await userModel.executeQuery(
      doNutStudentsQuery,
      params,
      "Errors fetching student data of the past 5 yrs"
    );

    const studentCountAppliedVsNot = {};
    resultForDoNutStudents.forEach((row) => {
      studentCountAppliedVsNot["Applied"] = row.appliedStudents;
      studentCountAppliedVsNot["NotApplied"] = row.notAppliedStudents;
    });

    // 3. Faculty count by department (only if status is HOI)
    let facultyCountByDepartment = {};
    let facultyParams = [];

    let facultyCountQuery = `
        SELECT tu.department, COUNT(DISTINCT lr.teacher_id) AS facultyCount
        FROM teacher_users tu LEFT JOIN lor_requests lr ON lr.teacher_id = tu.id
        AND lr.status IN ('ACCEPTED', 'FINISHED') AND YEAR(lr.created_at) = YEAR(CURDATE())
        WHERE tu.campus = ?
      `;

    facultyParams.push(user.campus);

    if (school != "") {
      facultyCountQuery += " AND tu.school = ?";
      facultyParams.push(school);
    }

    facultyCountQuery += " GROUP BY tu.department";

    const resultForPresentFaculty = await userModel.executeQuery(
      facultyCountQuery,
      facultyParams, // Use only campus as parameter
      "Error fetching requested faculty count details"
    );

    resultForPresentFaculty.forEach((row) => {
      facultyCountByDepartment[row.department || "Unknown"] = row.facultyCount;
    });

    //4. top 10 faculty departments giving LoRs
    const top10FacultyCountByDepartment = {};
    facultyCountQuery += " ORDER BY facultyCount DESC LIMIT 10";

    const resultForTop10Faculty = await userModel.executeQuery(
      facultyCountQuery,
      facultyParams,
      "Error fetching top 10 requested faculty count details"
    );

    resultForTop10Faculty.forEach((row) => {
      top10FacultyCountByDepartment[row.department || "Unknown"] =
        row.facultyCount;
    });

    //5. top 10 university countries
    let topCountriesQuery = `
      SELECT university_country, COUNT(*) AS total 
      FROM universities WHERE campus = ?
    `;

    if (user.status == "HOD") {
      topCountriesQuery += " AND school = ? AND department = ?";
    }
    if (school != "") {
      topCountriesQuery += " AND school = ?";
    }
    if (dept != "") {
      topCountriesQuery += " AND department = ?";
    }

    topCountriesQuery +=
      "GROUP BY university_country ORDER BY total DESC LIMIT 10";

    const resultTop10UniversityCountries = await userModel.executeQuery(
      topCountriesQuery,
      params,
      "Error fetching top 10 university countries"
    );
    const top10UniversityCountries = {};
    resultTop10UniversityCountries.forEach((row) => {
      top10UniversityCountries[row.university_country || "Unknown"] = row.total;
    });

    //6. Top 10 university names students applied
    let topNamesQuery = `
      SELECT university_name, COUNT(*) AS total 
      FROM universities WHERE campus = ?
    `;

    if (user.status == "HOD") {
      topNamesQuery += " AND school = ? AND department = ?";
    }
    if (school != "") {
      topNamesQuery += " AND school = ?";
    }
    if (dept != "") {
      topNamesQuery += " AND department = ?";
    }

    topNamesQuery += "GROUP BY university_name ORDER BY total DESC LIMIT 10";

    const resultTop10UniversityNames = await userModel.executeQuery(
      topNamesQuery,
      params,
      "Error fetching top 10 university names"
    );
    const top10UniversityNames = {};
    resultTop10UniversityNames.forEach((row) => {
      top10UniversityNames[row.university_name || "Unknown"] = row.total;
    });

    // Prepare response based on status
    let response = {
      studentCountForFiveYrs,
      studentCountAppliedVsNot,
      facultyCountByDepartment,
      top10FacultyCountByDepartment,
      top10UniversityCountries,
      top10UniversityNames,
    };

    res.json(response);
  } catch (error) {
    console.error("Error in getAnalysis:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createDepartmentAdmin = async (req, res) => {
  const { id, name, gitamEmail, password, campus, school, department } =
    req.body;

  if (
    !id ||
    !name ||
    !gitamEmail ||
    !password ||
    !campus ||
    !school ||
    !department
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }

  try {
    const existingAdmin = await checkAlreadyExistenceInDeptAdmin(
      id,
      campus,
      school,
      department
    );

    if (existingAdmin) {
      return res.status(409).json({
        message:
          existingAdmin.id === id
            ? "Current Employee ID is already an admin for a department"
            : "An admin for this department already exists.",
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    await createDepartmentAdmin({
      id,
      name,
      gitamEmail,
      password: hashedPassword,
      campus,
      school,
      department,
    });

    res
      .status(201)
      .json({ message: "Departmental Admin created successfully." });
  } catch (error) {
    console.error("Error creating departmental admin:", error.message);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

exports.getDeleteRequestedLoRs = async (req, res) => {
  const { id } = req.params;
  const params = [];
  try {
    const user = await userModel.findUserById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let sql =
      "SELECT lr.request_id, lr.student_id, lr.teacher_id, lr.status FROM lor_requests lr JOIN student_users su ON lr.student_id = su.id WHERE lr.status = 'REQUESTED TO DELETE'";
    if (user.role === "department_admin") {
      sql += " AND su.department = ? AND su.school = ? AND su.campus = ?";
      params.push(user.department, user.school, user.campus);
    }
    const rows = await userModel.executeQuery(
      sql,
      params,
      "Error fetching requested LoRs"
    );
    res.json({ requests: rows });
  } catch (error) {
    console.error("Error in fetching requested LoRs:", error);
    res.status(500).json({ message: "Failed to fetch requested LoRs" });
  }
};

/**
 * POST /api/admin/bulk-upload
 * Receives an array of user objects (students and teachers) and creates users in bulk.
 * For each student or teacher created, a corresponding profile record is also inserted.
 */
exports.bulkUploadUsers = async (req, res) => {
  const { data } = req.body;
  if (!data || !Array.isArray(data)) {
    return res
      .status(400)
      .json({ message: "Invalid data. Expected an array of user objects." });
  }
  try {
    for (const row of data) {
      const role = row.role?.toLowerCase();
      if (role === "student") {
        // Hash the password before inserting
        const hashedPwd = await bcrypt.hash(row.password, 10);
        // Create the student record
        await userModel.createStudent({
          id: row.id,
          name: row.name,
          gitamEmail: row.gitamEmail,
          personalEmail: row.personalEmail || "",
          campus: row.campus,
          school: row.school,
          department: row.department,
          specialization: row.specialization,
          yearOfPassout: row.yearOfPassout
            ? parseInt(row.yearOfPassout, 10)
            : null,
          password: hashedPwd,
        });
        // Create the associated student profile with the same id
        await userModel.createStudentProfile({
          id: row.id,
          linkedin: row.linkedin || "",
          twitter: row.twitter || "",
          portfolio: row.portfolio || "",
          bio: row.bio || "",
        });
      } else if (role === "teacher") {
        // Hash the password before inserting
        const hashedPwd = await bcrypt.hash(row.password, 10);
        // Create the teacher record
        await userModel.createTeacher({
          id: row.id,
          name: row.name,
          gitamEmail: row.gitamEmail,
          phone: row.phone || "",
          campus: row.campus,
          school: row.school,
          department: row.department,
          specialization: row.specialization,
          designation: row.designation || "",
          password: hashedPwd,
        });
        // Create the associated faculty profile with the same id
        await userModel.createFacultyProfile({
          id: row.id,
          qualifications: row.qualifications || "",
          research_interests: row.research_interests || "",
          bio: row.bio || "",
        });
      } else {
        console.warn(`Skipping row with unrecognized role: ${row.role}`);
      }
    }
    res.status(200).json({ message: "Bulk upload successful." });
  } catch (err) {
    console.error("Bulk upload error:", err);
    res
      .status(500)
      .json({ message: "Error during bulk upload", error: err.message });
  }
};
