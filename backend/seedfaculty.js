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
  "School of Business": ["Business Administration", "Management Studies"],
  "School of Humanities & Social Sciences": [
    "English",
    "Economics",
    "Fine Arts",
    "History",
    "Media Studies and Visual Communication",
    "Political Science",
    "Psychology",
    "Sociology",
  ],
  "School of Law": ["Labor and Industrial Law", "Corporate Law"],
  "School of Pharmacy": ["Pharmaceutical Chemistry", "Biotechnology"],
  "School of Science": [
    "Physics",
    "Food Science and Technology",
    "Mathematics",
    "Chemistry",
  ],
  "School of Technology": [
    "Aerospace Engineering",
    "Civil Engineering",
    "Computer Science & Engineering",
    "Electrical, Electronics & Communication Engineering",
    "Mechanical Engineering",
  ],
};

const allSpecializations = {
  Architecture: ["General", "Specialization"],
  "Business Administration": ["General", "Specialization"],
  "Management Studies": ["General", "Specialization"],
  English: ["General"],
  Economics: ["General"],
  "Fine Arts": ["General"],
  History: ["General"],
  "Media Studies and Visual Communication": ["General"],
  "Political Science": ["General"],
  Psychology: ["General"],
  Sociology: ["General"],
  "Labor and Industrial Law": ["General"],
  "Corporate Law": ["General"],
  "Pharmaceutical Chemistry": ["General"],
  Biotechnology: ["General"],
  Physics: ["General"],
  "Food Science and Technology": ["General"],
  Mathematics: ["General"],
  Chemistry: ["General"],
  "Aerospace Engineering": ["General"],
  "Civil Engineering": ["General", "Specialization"],
  "Computer Science & Engineering": ["General", "Specialization"],
  "Electrical, Electronics & Communication Engineering": [
    "General",
    "Specialization",
  ],
  "Mechanical Engineering": ["General", "Specialization"],
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
