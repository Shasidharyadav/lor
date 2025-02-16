/********************************************************
 * adminController.js
 * All admin-specific logic for:
 *   - Dashboard stats
 *   - Listing/filtering Students, Faculty, All Users
 *   - Deleting users
 *   - Generating/fetching reports
 ********************************************************/
const userModel = require("../models/userModel");
const { constrainedMemory } = require("process");

/**
 * GET /api/admin/dashboard-stats
 * Returns high-level stats for Admin Dashboard:
 *  - # of students, # of faculty, # of admins, total
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

    res.json({
      stats,
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
 */
exports.getAllFaculty = async (req, res) => {
  const { campus, school, department, specialization } = req.query;

  let sql = "SELECT * FROM teacher_users WHERE 1=1";
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
 * Fetch all users from all three tables (students, teacher, admin).
 * Optionally filter by role=? (student | teacher | admin).
 */
exports.getAllUsers = async (req, res) => {
  const { role } = req.query;

  try {
    let users = [];

    if (!role) {
      // Fetch from all three tables
      const studentRows = await userModel.executeQuery(
        "SELECT id, name, gitamEmail, 'student' AS role FROM student_users",
        [],
        "Error fetching students"
      );
      const teacherRows = await userModel.executeQuery(
        "SELECT id, name, gitamEmail, 'teacher' AS role FROM teacher_users",
        [],
        "Error fetching teachers"
      );
      const adminRows = await userModel.executeQuery(
        "SELECT id, name, gitamEmail, 'admin' AS role FROM admin_users",
        [],
        "Error fetching admins"
      );
      users = [...studentRows, ...teacherRows, ...adminRows];
    } else {
      // Filter by role
      if (role === "student") {
        users = await userModel.executeQuery(
          "SELECT id, name, gitamEmail, 'student' AS role FROM student_users",
          [],
          "Error fetching students"
        );
      } else if (role === "teacher") {
        users = await userModel.executeQuery(
          "SELECT id, name, gitamEmail, 'teacher' AS role FROM teacher_users",
          [],
          "Error fetching teachers"
        );
      } else if (role === "admin") {
        users = await userModel.executeQuery(
          "SELECT id, name, gitamEmail, 'admin' AS role FROM admin_users",
          [],
          "Error fetching admins"
        );
      } else {
        // Invalid role, return empty or error
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
    //    Your userModel might have a findUserById method that checks all 3 tables.
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

// Controller to fetch LOR requests by ID, student, or teacher
exports.getRequestsForAdmin = async (req, res) => {
  const { request_id, student_id, teacher_id } = req.query;
  let sql = "SELECT * FROM lor_requests WHERE 1=1";
  let params = [];

  if (request_id != null) {
    sql += " AND request_id = ?";
    params.push(request_id);
  }
  if (student_id != null) {
    sql += " AND student_id = ?";
    params.push(student_id);
  }
  if (teacher_id != null) {
    sql += " AND teacher_id = ?";
    params.push(teacher_id);
  }
  try {
    // console.log("Fetching LOR requests with filters:", {
    //   request_id,
    //   student_id,
    //   teacher_id,
    // });
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
  // console.log("Deleting request with ID:", request_id);
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
 * Returns a list of available reports or some placeholder data
 * that the front-end can use to generate/download.
 */
exports.getReports = async (req, res) => {
  try {
    // This could be dynamic or from a "reports" table. We'll just mock it:
    const reports = [
      { id: 1, title: "Monthly Users Report" },
      { id: 2, title: "Active vs. Inactive Users" },
      { id: 3, title: "Student/Teacher Distribution" },
      // ...
    ];

    // Or fetch from DB if you have a reports table
    // const reports = await userModel.executeQuery("SELECT * FROM reports", [], "Error fetching reports");

    res.json(reports);
  } catch (error) {
    console.error("Error in getReports:", error);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};
// Example: generate an Excel file based on filters
exports.exportReports = async (req, res) => {
  try {
    const { campus, school, department, specialization, reportId } = req.query;

    // 1) Query the database based on these filters to get the data you want to export.
    //    For example, all users count by campus, or a specific "reportId" record, etc.

    // 2) Generate an Excel (or CSV) file in-memory.
    //    Common libraries: exceljs, node-xlsx, or just create CSV manually.

    // For demonstration, let's assume we create a simple CSV:
    const csvHeader = "Campus,School,Department,Specialization,UsersCount\n";
    const csvData = [
      `${campus || "All"},${school || "All"},${department || "All"},${
        specialization || "All"
      },42`,
    ].join("\n");

    const csvContent = csvHeader + csvData;

    // 3) Set headers to prompt download. Example for CSV:
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="report_export.csv"`
    );

    // 4) Send the data
    return res.send(csvContent);

    // For an Excel file, you'd generate a buffer (via exceljs, for instance), then:
    // res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    // res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
    // res.send(excelBuffer);
  } catch (error) {
    console.error("Error exporting reports:", error);
    return res.status(500).json({ message: "Failed to export reports" });
  }
};
/**
 * GET /api/admin/dashboard-stats
 * Returns high-level stats for Admin Dashboard, plus campus-wise
 * and branch/department-wise distributions.
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
    // 2) Campus Distribution (for students and teachers only)
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
          admins: 0, // Will remain 0 as we don't compute admin counts by campus
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
    // 3) Branch/Department Distribution
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
 * get analysis for admin view analysis page
 * admin/analysis
 */
exports.getAnalysis = async (req, res) => {
  const { dept, school, campus } = req.query;
  try {
    let query = `
      SELECT YEAR(lr.created_at) AS year, COUNT(DISTINCT lr.student_id) AS studentCount FROM lor_requests lr JOIN student_users su ON lr.student_id = su.id WHERE YEAR(lr.created_at) > YEAR(CURDATE()) - 5`;

    let params = [];

    if (dept !== "ALL") {
      query += " AND su.department = ?";
      params.push(dept);
    }
    if (school !== "ALL") {
      query += " AND su.school = ?";
      params.push(school);
    }
    if (campus !== "ALL") {
      query += " AND su.campus = ?";
      params.push(campus);
    }

    // Ensure conditions are before GROUP BY
    query += " GROUP BY YEAR(lr.created_at) ORDER BY YEAR(lr.created_at) ASC";

    // Execute the query
    const resultForFiveYrsStudent = await userModel.executeQuery(
      query,
      params,
      "Errors fetching student data of the past 5 yrs"
    );

    // Convert to desired format
    const studentCountForFiveYrs = {};
    resultForFiveYrsStudent.forEach((row) => {
      studentCountForFiveYrs[row.year] = row.studentCount;
    });
    query =
      "SELECT department, COUNT(DISTINCT teacher_id) FROM lor_requests WHERE status IN ('ACCEPTED', 'FINISHED') GROUP BY department";

    params = [];

    if (school != "ALL") {
      query += " AND school = ?";
      params.push(school);
    }
    if (campus != "ALL") {
      query += " AND campus = ?";
      params.push(campus);
    }
    const resultForPresentFaculty = await userModel.executeQuery(
      query,
      params,
      "Error fetching requested faculty count details"
    );
    const facultyCountByDepartment = {};
    resultForPresentFaculty.forEach((row) => {
      const department = row.department;
      const count = row["COUNT(DISTINCT teacher_id)"];
      facultyCountByDepartment[department] = count;
    });

    query =
      "SELECT university_country, COUNT(*) FROM universities GROUP BY university_country";

    params = [];

    if (dept !== "ALL") {
      query += " AND su.department = ?";
      params.push(dept);
    }
    if (school !== "ALL") {
      query += " AND su.school = ?";
      params.push(school);
    }
    if (campus !== "ALL") {
      query += " AND su.campus = ?";
      params.push(campus);
    }
    const resultTop10UniversityCountries = await userModel.executeQuery(
      query,
      params,
      "Error fetching top 10 university names"
    );
    const top10UniversityCountries = {};
    resultTop10UniversityCountries.forEach((row) => {
      const university_country = row.university_country;
      const count = row["COUNT(*)"];
      top10UniversityCountries[university_country] = count;
    });

    query =
      "SELECT university_name, COUNT(*) FROM universities GROUP BY university_name";

    params = [];

    if (dept !== "ALL") {
      query += " AND su.department = ?";
      params.push(dept);
    }
    if (school !== "ALL") {
      query += " AND su.school = ?";
      params.push(school);
    }
    if (campus !== "ALL") {
      query += " AND su.campus = ?";
      params.push(campus);
    }
    const resultTop10UniversityNames = await userModel.executeQuery(
      query,
      params,
      "Error fetching top 10 university names"
    );
    const top10UniversityNames = {};
    resultTop10UniversityNames.forEach((row) => {
      const university_name = row.university_name;
      const count = row["COUNT(*)"];
      top10UniversityNames[university_name] = count;
    });

    res.json({
      studentCountForFiveYrs: studentCountForFiveYrs,
      facultyCountByDepartment: facultyCountByDepartment,
      top10UniversityCountries: top10UniversityCountries,
      top10UniversityNames: top10UniversityNames,
    });
  } catch (error) {
    console.error("Error in getAnalysis:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
