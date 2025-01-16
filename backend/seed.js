// backend/seed.js

const bcrypt = require('bcryptjs');
const userModel = require('./models/userModel'); // Adjust the path if necessary
const lorModel = require('./models/lorModel');   // Adjust the path if necessary

// Sample Indian names for students, teachers, and admins
const studentNames = [
  "Aarav Sharma", "Vivaan Singh", "Aditya Gupta", "Vihaan Mehta", "Arjun Reddy",
  "Sai Kumar", "Krishna Patel", "Ishaan Joshi", "Rohan Desai", "Dhruv Nair",
  "Ayaan Verma", "Sai Kiran", "Kartik Rao", "Raghav Sen", "Anand Shah",
  "Ritvik Bose", "Yash Kapoor", "Siddharth Iyer", "Neil Jain", "Tejas Malhotra"
];

const teacherNames = [
  "Dr. Priya Menon", "Prof. Anil Kumar", "Dr. Sangeeta Rao", "Prof. Ramesh Gupta",
  "Dr. Kavita Sharma", "Prof. Sunil Verma", "Dr. Nisha Patel", "Prof. Rajesh Singh",
  "Dr. Meena Iyer", "Prof. Ashok Reddy", "Dr. Rekha Joshi", "Prof. Vijay Desai",
  "Dr. Lata Nair", "Prof. Deepak Verma", "Dr. Suresh Rao", "Prof. Neha Shah",
  "Dr. Anita Bose", "Prof. Manoj Kapoor", "Dr. Geeta Iyer", "Prof. Sanjay Jain"
];

const adminNames = [
  "Mr. Amit Singh", "Ms. Neha Sharma", "Mr. Ravi Patel", "Ms. Anjali Gupta",
  "Mr. Karan Mehta", "Ms. Sushma Reddy", "Mr. Naveen Kumar", "Ms. Pooja Rao",
  "Mr. Rakesh Verma", "Ms. Kavita Shah", "Mr. Sameer Joshi", "Ms. Alka Desai",
  "Mr. Arvind Nair", "Ms. Sunita Verma", "Mr. Vijay Sharma", "Ms. Rekha Iyer",
  "Mr. Mohan Rao", "Ms. Priyanka Patel", "Mr. Rahul Singh", "Ms. Geeta Malhotra"
];

// Function to generate unique IDs
const generateId = (prefix, index) => {
  return `${prefix}${String(index).padStart(3, '0')}`;
};

// Function to generate email from name
const generateEmail = (name, role) => {
  const emailName = name.toLowerCase().replace(/[^a-z.]/g, '').replace(/ /g, '.');
  let domain = 'gitam.edu';
  if (role === 'student') {
    domain = 'gitam.in';
  }
  return `${emailName}@${domain}`;
};

// Helper functions
const getRandomItem = (array) => {
  if (!array || array.length === 0) return "";
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomYear = () => {
  const currentYear = new Date().getFullYear();
  return Math.floor(Math.random() * 6) + (currentYear - 5); // Past 5 years
};

const generatePhoneNumber = () => {
  let phone = '9';
  for (let i = 0; i < 9; i++) {
    phone += Math.floor(Math.random() * 10).toString();
  }
  return phone;
};

// Campuses, Schools, Departments, Specializations
const campuses = ["Vishakhapatnam", "Hyderabad", "Bengaluru"];

const allSchools = {
  'Vishakhapatnam': [
    "School of Architecture",
    "School of Business",
    "School of Humanities & Social Sciences",
    "School of Law",
    "School of Pharmacy",
    "School of Science",
    "School of Technology"
  ],
  'Hyderabad': [
    "School of Architecture",
    "School of Business",
    "School of Humanities & Social Sciences",
    "School of Pharmacy",
    "School of Science",
    "School of Technology"
  ],
  'Bengaluru': [
    "School of Business",
    "School of Humanities & Social Sciences",
    "School of Science",
    "School of Technology"
  ]
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
    "Department of Mechanical Engineering"
  ]
};

const allSpecializations = {
  "Department of Physics": [
    "Quantum Mechanics",
    "Astrophysics",
    "Particle Physics",
    "Optics",
    "Condensed Matter"
  ],
  "Department of Food Science and Technology": [
    "Food Chemistry",
    "Food Microbiology",
    "Food Engineering",
    "Nutraceuticals",
    "Food Safety"
  ],
  "Department of Mathematics": [
    "Algebra",
    "Calculus",
    "Statistics",
    "Applied Mathematics",
    "Discrete Mathematics"
  ],
  "Department of Chemistry": [
    "Organic Chemistry",
    "Inorganic Chemistry",
    "Physical Chemistry",
    "Analytical Chemistry",
    "Biochemistry"
  ],
  "Department of Pharmaceutical Chemistry": [
    "Drug Design",
    "Pharmacognosy",
    "Pharmacology",
    "Medicinal Chemistry",
    "Pharmaceutical Analysis"
  ],
  "Department of Biotechnology": [
    "Genetic Engineering",
    "Microbial Biotechnology",
    "Bioinformatics",
    "Industrial Biotechnology",
    "Environmental Biotechnology"
  ],
  "Department of Labor and Industrial Law": [
    "Employment Law",
    "Industrial Relations",
    "Labor Economics",
    "Human Resource Management",
    "Trade Unionism"
  ],
  "Department of Corporate Law": [
    "Company Law",
    "Tax Law",
    "Securities Law",
    "Intellectual Property Law",
    "International Corporate Law"
  ],
  "Department of English": [
    "Literature",
    "Linguistics",
    "Creative Writing",
    "Technical Writing",
    "English Language Teaching"
  ],
  "Department of Economics": [
    "Microeconomics",
    "Macroeconomics",
    "Development Economics",
    "International Economics",
    "Behavioral Economics"
  ],
  "Department of Fine Arts": [
    "Painting",
    "Sculpture",
    "Digital Arts",
    "Graphic Design",
    "Photography"
  ],
  "Department of History": [
    "Ancient History",
    "Medieval History",
    "Modern History",
    "Economic History",
    "Cultural History"
  ],
  "Department of Media Studies and Visual Communication": [
    "Journalism",
    "Film Studies",
    "Advertising",
    "Public Relations",
    "Digital Media"
  ],
  "Department of Political Science": [
    "International Relations",
    "Political Theory",
    "Public Administration",
    "Comparative Politics",
    "Political Economy"
  ],
  "Department of Psychology": [
    "Clinical Psychology",
    "Cognitive Psychology",
    "Social Psychology",
    "Developmental Psychology",
    "Industrial-Organizational Psychology"
  ],
  "Department of Sociology": [
    "Social Theory",
    "Urban Sociology",
    "Medical Sociology",
    "Cultural Sociology",
    "Environmental Sociology"
  ],
  "Department of Architecture": [
    "Sustainable Design",
    "Urban Planning",
    "Landscape Architecture",
    "Interior Design",
    "Historic Preservation"
  ],
  "Department of Management Studies": [
    "Operations Management",
    "Entrepreneurship",
    "Strategic Management",
    "Organizational Behavior",
    "Supply Chain Management"
  ],
  "Department of Business Administration": [
    "General Management",
    "Financial Markets",
    "Marketing",
    "Human Resource Management",
    "Business Analytics"
  ],
  "Department of Aerospace Engineering": [
    "Aerodynamics",
    "Propulsion",
    "Structural Analysis",
    "Avionics",
    "Space Systems"
  ],
  "Department of Civil Engineering": [
    "Structural Engineering",
    "Environmental Engineering",
    "Transportation Engineering",
    "Construction Management",
    "Artificial Intelligence and Machine Learning",
    "Construction Administration",
  ],
  "Department of Computer Science & Engineering": [
    "Artificial Intelligence and Machine Learning",
    "Cyber Security",
    "Data Science",
    "Internet of Things",
    "Computer Science and Business Systems"
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
    "Robotics and Artificial Intelligence",
    "Thermodynamics",
    "Fluid Mechanics",
    "Manufacturing Processes",
    "General",
  ]
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log("Starting database seeding...");

    // 1. Insert Students
    console.log("Inserting students...");
    const studentIds = [];
    for (let i = 1; i <= 20; i++) {
      const name = studentNames[i - 1];
      const id = generateId('STU', i);
      const gitamEmail = generateEmail(name, 'student');
      const personalEmail = `student${i}@gmail.com`; // Ensure uniqueness
      const campus = getRandomItem(campuses);
      const school = getRandomItem(allSchools[campus]);
      const department = getRandomItem(allDepartments[school]);
      const specialization = getRandomItem(allSpecializations[department]);
      const yearOfPassout = getRandomYear();

      // Create student user
      await userModel.createStudent({
        id,
        name,
        gitamEmail,
        personalEmail,
        campus,
        school,
        department,
        specialization,
        yearOfPassout,
        password: await hashPassword("Testing@123")
      });

      // Create student profile
      await userModel.createStudentProfile({
        id,
        linkedin: `https://linkedin.com/in/${id.toLowerCase()}`,
        twitter: `https://twitter.com/${id.toLowerCase()}`,
        portfolio: `https://portfolio.com/${id.toLowerCase()}`,
        bio: `Hello, I am ${name}, currently pursuing my studies in ${department} at GITAM University.`
      });

      studentIds.push(id);
      console.log(`Inserted student: ${id} - ${name}`);
    }

    // 2. Insert Teachers
    console.log("Inserting teachers...");
    const teacherIds = [];
    for (let i = 1; i <= 20; i++) {
      const name = teacherNames[i - 1];
      const id = generateId('TEA', i);
      const gitamEmail = generateEmail(name, 'teacher');
      const phone = generatePhoneNumber();
      const campus = getRandomItem(campuses);
      const school = getRandomItem(allSchools[campus]);
      const department = getRandomItem(allDepartments[school]);
      const specialization = getRandomItem(allSpecializations[department]);
      const designation = getRandomItem(["Assistant Professor", "Associate Professor", "Professor"]);

      // Create teacher user
      await userModel.createTeacher({
        id,
        name,
        gitamEmail,
        phone,
        campus,
        school,
        department,
        specialization,
        designation,
        password: await hashPassword("Testing@123")
      });

      // Create faculty profile
      await userModel.createFacultyProfile({
        id,
        qualifications: "Ph.D. in " + department,
        research_interests: getRandomResearchInterests(specialization),
        bio: `Dr. ${name} is a dedicated faculty member in the ${department} at GITAM University.`
      });

      teacherIds.push(id);
      console.log(`Inserted teacher: ${id} - ${name}`);
    }

    // 3. Insert Admins
    console.log("Inserting admins...");
    const adminIds = [];
    for (let i = 1; i <= 20; i++) {
      const name = adminNames[i - 1];
      const id = generateId('ADM', i);
      const gitamEmail = generateEmail(name, 'admin');
      const school = getRandomItem(Object.keys(allSchools));
      const department = getRandomItem(["Administration", "Finance", "HR", "IT", "Operations"]);

      // Create admin user and profile
      await userModel.createAdmin({
        id,
        name,
        gitamEmail,
        password: await hashPassword("Testing@123"),
        school,
        department
      });

      adminIds.push(id);
      console.log(`Inserted admin: ${id} - ${name}`);
    }

    // 4. Insert LoR Requests
    console.log("Inserting LoR requests...");
    const statuses = ['PENDING', 'APPROVED', 'DECLINED', 'FINISHED', 'EXPIRED'];
    const universitiesList = [
      "Harvard University", "Stanford University", "MIT", "University of Cambridge",
      "Oxford University", "Caltech", "Princeton University", "Yale University",
      "Columbia University", "University of Chicago", "University of California, Berkeley",
      "ETH Zurich", "University of Toronto", "National University of Singapore",
      "Tsinghua University", "Peking University", "University of Melbourne",
      "University of Tokyo", "Korea Advanced Institute of Science and Technology",
      "University of Edinburgh"
    ];

    // Create 50 LoR requests with random statuses
    for (let i = 1; i <= 50; i++) {
      const teacher_id = getRandomItem(teacherIds);
      const student_id = getRandomItem(studentIds);
      const campus = getRandomItem(campuses);
      const school = getRandomItem(allSchools[campus]);
      const department = getRandomItem(allDepartments[school]);
      const specialization = getRandomItem(allSpecializations[department]);
      const lor_content = `I am pleased to recommend ${student_id} for further studies.`;
      const universities = getRandomUniversities();

      const status = getRandomItem(statuses);

      // For 'APPROVED' and 'FINISHED' statuses, include final letter details
      let lor_data = {
        teacher_id,
        student_id,
        campus,
        school,
        department,
        specialization,
        lor_content,
        universities,
        status
      };

      if (status === 'APPROVED' || status === 'FINISHED') {
        const teacherName = teacherNames[teacherIds.indexOf(teacher_id)];
        lor_data.name_address = `Dr. ${teacherName.split(' ')[1]}, GITAM University`;
        lor_data.name_signature = `Dr. ${teacherName.split(' ')[1]}`;
        lor_data.teacher_designation = getRandomItem(["Assistant Professor", "Associate Professor", "Professor"]);
        lor_data.teacher_department = department;
        lor_data.teacher_campus = campus;
        lor_data.teacher_email = generateEmail(teacherName, 'teacher');
        lor_data.teacher_phone = generatePhoneNumber();
      }

      if (status === 'FINISHED') {
        // Create and finalize the LoR request
        const requestId = await lorModel.createLorRequest(lor_data);
        await lorModel.finalizeLorRequest(requestId, {
          lor_content: lor_data.lor_content,
          name_address: lor_data.name_address,
          name_signature: lor_data.name_signature,
          teacher_designation: lor_data.teacher_designation,
          teacher_department: lor_data.teacher_department,
          teacher_campus: lor_data.teacher_campus,
          teacher_email: lor_data.teacher_email,
          teacher_phone: lor_data.teacher_phone,
        });
      } else {
        // Create LoR request without finalizing
        await lorModel.createLorRequest(lor_data);
      }

      console.log(`Inserted LoR request ${i} with status ${status}`);
    }

    // 5. Insert Additional Declined Requests for Filtering
    console.log("Inserting declined LoR requests for filtering...");
    for (let i = 1; i <= 5; i++) {
      const teacher_id = getRandomItem(teacherIds);
      const student_id = getRandomItem(studentIds);
      const campus = getRandomItem(campuses);
      const school = getRandomItem(allSchools[campus]);
      const department = getRandomItem(allDepartments[school]);
      const specialization = getRandomItem(allSpecializations[department]);
      const lor_content = `I regret to inform that I cannot provide a recommendation for ${student_id} at this time.`;
      const universities = getRandomUniversities();

      const lor_data = {
        teacher_id,
        student_id,
        campus,
        school,
        department,
        specialization,
        lor_content,
        universities,
        status: 'DECLINED'
      };

      await lorModel.createLorRequest(lor_data);
      console.log(`Inserted declined LoR request for teacher ${teacher_id} and student ${student_id}`);
    }

    console.log("Database seeding completed successfully!");

    process.exit(0); // Exit the script

  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1); // Exit with failure
  }
};

// Helper function to hash passwords
const hashPassword = async (plainPassword) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(plainPassword, salt);
  return hashed;
};

// Helper function to generate random research interests based on specialization
const getRandomResearchInterests = (specialization) => {
  // For simplicity, return a generic interest
  return `Research interests in ${specialization}`;
};

// Helper function to generate random universities array
const getRandomUniversities = () => {
  const count = Math.floor(Math.random() * 5) + 1; // 1 to 5 universities
  const shuffled = universitiesList.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const universitiesList = [
  "Harvard University", "Stanford University", "MIT", "University of Cambridge",
  "Oxford University", "Caltech", "Princeton University", "Yale University",
  "Columbia University", "University of Chicago", "University of California, Berkeley",
  "ETH Zurich", "University of Toronto", "National University of Singapore",
  "Tsinghua University", "Peking University", "University of Melbourne",
  "University of Tokyo", "Korea Advanced Institute of Science and Technology",
  "University of Edinburgh"
];

// Run the seed function
seedDatabase();
