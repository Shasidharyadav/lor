require("dotenv").config();
const bcrypt = require("bcrypt");
const userModel = require("./models/userModel"); 


const campusToSchools = {
  "Vishakhapatnam": [
    "School of Architecture",
    "School of Business",
    "School of Humanities & Social Sciences",
    "School of Law",
    "School of Pharmacy",
    "School of Science",
    "School of Technology",
  ],
  "Hyderabad": [
    "School of Architecture",
    "School of Business",
    "School of Humanities & Social Sciences",
    "School of Pharmacy",
    "School of Science",
    "School of Technology",
  ],
  "Bengaluru": [
    "School of Business",
    "School of Humanities & Social Sciences",
    "School of Science",
    "School of Technology",
  ],
};

const allDepartments = {
  "School of Architecture": [
    "Department of Architecture",
  ],
  "School of Business": [
    "Department of Business Administration",
    "Department of Management Studies",
  ],
  "School of Humanities & Social Sciences": [
    "Department of English",
    "Department of Economics",
    "Department of Fine Arts",
    "Department of History",
    "Department of Media Studies and Visual Communication",
    "Department of Political Science",
    "Department of Psychology",
    "Department of Sociology",
  ],
  "School of Law": [
    "Department of Labor and Industrial Law",
    "Department of Corporate Law",
  ],
  "School of Pharmacy": [
    "Department of Pharmaceutical Chemistry",
    "Department of Biotechnology",
  ],
  "School of Science": [
    "Department of Physics",
    "Department of Food Science and Technology",
    "Department of Mathematics",
    "Department of Chemistry",
  ],
  "School of Technology": [
    "Department of Aerospace Engineering",
    "Department of Civil Engineering",
    "Department of Computer Science & Engineering",
    "Department of Electrical, Electronics & Communication Engineering",
    "Department of Mechanical Engineering",
  ],
};

const allSpecializations = {
  "Department of Architecture": [
    "General",
  ],
  "Department of Business Administration": [
    "General",
    "Financial Markets",
    "Marketing",
    "Human Resource Management",
    "Business Analytics",
  ],
  "Department of Management Studies": [
    "Operations Management",
    "Entrepreneurship",
  ],
  "Department of English": [
    "General",
  ],
  "Department of Economics": [
    "General",
  ],
  "Department of Fine Arts": [
    "General",
  ],
  "Department of History": [
    "General",
  ],
  "Department of Media Studies and Visual Communication": [
    "General",
  ],
  "Department of Political Science": [
    "General",
  ],
  "Department of Psychology": [
    "General",
  ],
  "Department of Sociology": [
    "General",
  ],
  "Department of Labor and Industrial Law": [
    "General",
  ],
  "Department of Corporate Law": [
    "General",
  ],
  "Department of Pharmaceutical Chemistry": [
    "General",
  ],
  "Department of Biotechnology": [
    "General",
  ],
  "Department of Physics": [
    "General",
  ],
  "Department of Food Science and Technology": [
    "General",
  ],
  "Department of Mathematics": [
    "General",
  ],
  "Department of Chemistry": [
    "General",
  ],
  "Department of Aerospace Engineering": [
    "General",
  ],
  "Department of Civil Engineering": [
    "General",
    "Artificial Intelligence and Machine Learning",
    "Construction Administration",
  ],
  "Department of Computer Science & Engineering": [
    "General",
    "Artificial Intelligence and Machine Learning",
    "Cyber Security",
    "Data Science",
    "Internet of Things",
    "Computer Science and Business Systems",
  ],
  "Department of Electrical, Electronics & Communication Engineering": [
    "Computer Science & Engineering",
    "Electronics and Communication Engineering",
    "Electronics and Communication Engineering - AIML",
    "Electronics and Communication Engineering - IOT",
    "Electronics and Communication Engineering - VLSI",
    "Electronics and Communication Engineering - VLSI IT",
    "Electrical and Electronics Engineering",
    "Electrical and Electronics Engineering - CA",
  ],
  "Department of Mechanical Engineering": [
    "Artificial Intelligence and Machine Learning",
    "General",
    "Robotics and Artificial Intelligence",
  ],
};

const firstNames = [
  "Amit", "Bhavna", "Charan", "Deepika", "Esha", "Farhan", "Gauri",
  "Harish", "Indira", "Jyoti", "Kunal", "Leela", "Manish", "Nalini",
  "Omkar", "Priya", "Qasim", "Rashmi", "Sneha", "Tanvi", "Uday", "Vaishali",
  "Waqar", "Xavier", "Yash", "Zara"
];

const lastNames = [
  "Singh", "Verma", "Iyer", "Nair", "Patel", "Kumar", "Mishra", "Sharma",
  "Reddy", "Das", "Ghosh", "Nath", "Mehta", "Chopra", "Chandra", "Dewan"
];

// Possible designations
const designations = ["Assistant Professor", "Associate Professor", "Professor"];

// Helper to pick a random item from an array
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a random Indian name
function generateRandomName() {
  const fName = randomItem(firstNames);
  const lName = randomItem(lastNames);
  return `${fName} ${lName}`;
}

// Generate a random 10-digit phone number
function generateRandomPhone() {
  let num = "";
  for (let i = 0; i < 10; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

async function seedAllFaculty() {
  try {
    // 1) Ensure tables exist
    await userModel.createTables();

    // 2) Pre-hash the password "test@123"
    const hashedPwd = await bcrypt.hash("test@123", 10);

    // We'll keep a counter for ID and for email uniqueness
    let teacherCount = 1;

    // For every campus
    for (const campus of Object.keys(campusToSchools)) {
      const schools = campusToSchools[campus];

      // For every school in that campus
      for (const school of schools) {
        const departments = allDepartments[school] || [];

        // For every department in that school
        for (const department of departments) {
          const specializations = allSpecializations[department] || [];

          // For every specialization in that department
          for (const specialization of specializations) {

            // We want 3 faculty for each combination
            for (let i = 0; i < 3; i++) {
              // Generate random teacher details
              const name = generateRandomName();
              const phone = generateRandomPhone();
              const designation = randomItem(designations);

              // Make a unique teacher ID, e.g. T001, T002, ...
              const teacherId = `T${String(teacherCount).padStart(4, "0")}`;

              // Generate an email that must end with @gitam.edu for teachers
              // e.g. 'faculty1@gitam.edu', 'faculty2@gitam.edu', ...
              const gitamEmail = `faculty${teacherCount}@gitam.edu`;

              // Insert teacher user
              await userModel.createTeacher({
                id: teacherId,
                name,
                gitamEmail,
                phone,
                campus,
                school,
                department,
                specialization,
                designation,
                password: hashedPwd,
              });

              // Optionally, create a faculty profile for each teacher
              // Just a sample text, you can vary as needed
              await userModel.createFacultyProfile({
                id: teacherId,
                qualifications: `Ph.D. in ${department.replace("Department of ", "")}`,
                research_interests: `Research in ${specialization} at ${department}`,
                bio: `Hello, I'm Professor ${name}, working at ${school} in ${campus} campus.`,
              });

              teacherCount++;
            }
          }
        }
      }
    }

    console.log("✅ Successfully created faculty for all combos!");
    console.log(`Total faculty created: ${teacherCount - 1}`);
    process.exit(0);

  } catch (error) {
    console.error("❌ Error seeding all faculty:", error);
    process.exit(1);
  }
}

seedAllFaculty();
