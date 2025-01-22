require("dotenv").config(); 
const bcrypt = require("bcrypt");
const userModel = require("./models/userModel"); // Adjust path as needed

async function seedUsers() {
  try {
    // 1) Create (or ensure) all tables exist
    await userModel.createTables();

    // 2) Common hashed password for all: "test@123"
    const hashedPwd = await bcrypt.hash("test@123", 10);

    // --------------------------------------------
    // STUDENT USERS
    // --------------------------------------------

    // Student #1
    await userModel.createStudent({
      id: "S001",
      name: "Aditi Singh",
      gitamEmail: "aditi.singh@gitam.in", // Valid for student (ends with @gitam.in or @gitam.edu)
      personalEmail: "aditi.singh@gmail.com",
      campus: "Vishakhapatnam",
      school: "School of Technology",
      department: "Department of Computer Science & Engineering",
      specialization: "Data Science",
      yearOfPassout: 2024,
      password: hashedPwd,
    });

    // (Optional) Create student #1 profile
    await userModel.createStudentProfile({
      id: "S001",
      linkedin: "https://linkedin.com/in/aditi-singh",
      twitter: "https://twitter.com/aditi_singh",
      portfolio: "https://aditisingh-portfolio.com",
      bio: "Hi, I'm Aditi, a final-year B.Tech CSE (Data Science) student at GITAM.",
    });

    // Student #2
    await userModel.createStudent({
      id: "S002",
      name: "Rahul Varma",
      gitamEmail: "rahul.varma@gitam.edu", // Also valid for a student
      personalEmail: "rahul.varma@hotmail.com",
      campus: "Hyderabad",
      school: "School of Business",
      department: "Department of Management Studies",
      specialization: "Entrepreneurship",
      yearOfPassout: 2025,
      password: hashedPwd,
    });

    // (Optional) Create student #2 profile
    await userModel.createStudentProfile({
      id: "S002",
      linkedin: "https://linkedin.com/in/rahul-varma",
      twitter: "",
      portfolio: "",
      bio: "Hello, I'm Rahul, pursuing MBA in Entrepreneurship at GITAM University.",
    });

    // --------------------------------------------
    // ADMIN USERS
    // --------------------------------------------
    await userModel.createAdmin({
      id: "A001",
      name: "Admin Root",
      gitamEmail: "admin.root@gitam.edu",
      password: hashedPwd,
    });

    // (Optional) Create admin profile
    await userModel.createAdminProfile({
      id: "A001",
      name: "Admin Root",
      school: "School of Administration", // Or any relevant
      department: "Administration Department",
    });

    console.log("✅ Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  }
}

// Run the seed function
seedUsers();
