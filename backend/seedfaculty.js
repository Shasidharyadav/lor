require("dotenv").config();
const bcrypt = require("bcrypt");
const userModel = require("./models/userModel");

const campusToSchools = {
  Vishakhapatnam: [
    "School of Architecture",
    "School of Business",
    "School of Humanities & Social Sciences",
    "School of Law",
    "School of Pharmacy",
    "School of Science",
    "School of Technology",
  ],
  Hyderabad: [
    "School of Architecture",
    "School of Business",
    "School of Humanities & Social Sciences",
    "School of Pharmacy",
    "School of Science",
    "School of Technology",
  ],
  Bengaluru: [
    "School of Business",
    "School of Humanities & Social Sciences",
    "School of Science",
    "School of Technology",
  ],
};

const allDepartments = {
  "School of Architecture": ["Department of Architecture"],
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
  "Department of Architecture": ["General", "Specialization"],
  "Department of Business Administration": ["General", "Specialization"],
  "Department of Management Studies": ["General", "Specialization"],
  "Department of English": ["General"],
  "Department of Economics": ["General"],
  "Department of Fine Arts": ["General"],
  "Department of History": ["General"],
  "Department of Media Studies and Visual Communication": ["General"],
  "Department of Political Science": ["General"],
  "Department of Psychology": ["General"],
  "Department of Sociology": ["General"],
  "Department of Labor and Industrial Law": ["General"],
  "Department of Corporate Law": ["General"],
  "Department of Pharmaceutical Chemistry": ["General"],
  "Department of Biotechnology": ["General"],
  "Department of Physics": ["General"],
  "Department of Food Science and Technology": ["General"],
  "Department of Mathematics": ["General"],
  "Department of Chemistry": ["General"],
  "Department of Aerospace Engineering": ["General"],
  "Department of Civil Engineering": ["General", "Specialization"],
  "Department of Computer Science & Engineering": ["General", "Specialization"],
  "Department of Electrical, Electronics & Communication Engineering": [
    "General",
    "Specialization",
  ],
  "Department of Mechanical Engineering": ["General", "Specialization"],
};

const firstNames = [
  "Amit",
  "Bhavna",
  "Charan",
  "Deepika",
  "Esha",
  "Farhan",
  "Gauri",
  "Harish",
  "Indira",
  "Jyoti",
  "Kunal",
  "Leela",
  "Manish",
  "Nalini",
  "Omkar",
  "Priya",
  "Qasim",
  "Rashmi",
  "Sneha",
  "Tanvi",
  "Uday",
  "Vaishali",
  "Waqar",
  "Xavier",
  "Yash",
  "Zara",
  "Arjun",
  "Vikas",
  "Suman",
  "Rohan",
  "Anjali",
  "Vijay",
  "Neha",
  "Ritu",
  "Pooja",
  "Sanjay",
  "Rahul",
  "Aniket",
  "Sunita",
  "Meena",
  "Suresh",
  "Rajesh",
  "Kavita",
  "Sanjana",
  "Rakesh",
  "Anuradha",
  "Vijayalakshmi",
  "Deepak",
  "Sahil",
  "Preeti",
  "Shruti",
  "Ramesh",
  "Devika",
  "Manoj",
  "Sonia",
  "Ayesha",
  "Ajay",
  "Sonal",
  "Prakash",
  "Monika",
  "Varun",
  "Nikhil",
  "Aparna",
  "Mohan",
  "Lakshmi",
  "Sudha",
  "Gurpreet",
  "Harpreet",
  "Amrita",
  "Bhavya",
  "Chitra",
  "Dinesh",
  "Ekta",
];

const lastNames = [
  "Singh",
  "Verma",
  "Iyer",
  "Nair",
  "Patel",
  "Kumar",
  "Mishra",
  "Sharma",
  "Reddy",
  "Das",
  "Ghosh",
  "Nath",
  "Mehta",
  "Chopra",
  "Chandra",
  "Dewan",
  "Shah",
  "Gupta",
  "Rao",
  "Agarwal",
  "Kapoor",
  "Bhatia",
  "Ahuja",
  "Jain",
  "Malhotra",
  "Saxena",
  "Khanna",
  "Bose",
  "Gandhi",
  "Mohan",
  "Prasad",
  "Sethi",
  "Singhania",
  "Upadhyay",
  "Thakur",
  "Rathore",
  "Talwar",
  "Khan",
  "Aziz",
  "Beg",
  "Siddiqui",
  "Ansari",
  "Malik",
  "Pathak",
  "Pandey",
  "Verghese",
  "Desai",
  "Mandal",
];

const designations = [
  "Assistant Professor",
  "Associate Professor",
  "Professor",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomName() {
  const fName = randomItem(firstNames);
  const lName = randomItem(lastNames);
  return `${fName} ${lName}`;
}

function generateRandomPhone() {
  let num = "";
  for (let i = 0; i < 10; i++) {
    num += Math.floor(Math.random() * 10);
  }
  return num;
}

// Set to track used names for uniqueness
const usedNames = new Set();

function generateUniqueRandomName() {
  let name;
  let attempts = 0;
  do {
    name = generateRandomName();
    attempts++;
    // Prevent potential infinite loop if names are exhausted
    if (attempts > 1000) break;
  } while (usedNames.has(name));
  usedNames.add(name);
  return name;
}

async function seedAllFaculty() {
  try {
    // 1) Ensure tables exist
    await userModel.createTables();

    // 2) Pre-hash the password "test@123"
    const hashedPwd = await bcrypt.hash("test@123", 10);

    let teacherCount = 1;

    for (const campus of Object.keys(campusToSchools)) {
      const schools = campusToSchools[campus];
      for (const school of schools) {
        const departments = allDepartments[school] || [];
        for (const department of departments) {
          const specializations = allSpecializations[department] || [];
          for (const specialization of specializations) {
            for (let i = 0; i < 3; i++) {
              // Generate a unique random teacher name
              const name = generateUniqueRandomName();
              const phone = generateRandomPhone();
              const designation = randomItem(designations);

              const teacherId = `T${String(teacherCount).padStart(4, "0")}`;
              const gitamEmail = `faculty${teacherCount}@gitam.edu`;

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

              await userModel.createFacultyProfile({
                id: teacherId,
                qualifications: `Ph.D. in ${department.replace(
                  "Department of ",
                  ""
                )}`,
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
