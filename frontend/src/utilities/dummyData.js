const dummyData = {
  users: [
    { userId: 'U123', username: 'student1', password: 'password123', role: 'student' },
    { userId: 'U124', username: 'teacher1', password: 'password456', role: 'teacher' },
    { userId: 'U125', username: 'admin', password: 'adminpass', role: 'admin' },
  ],
  faculty: [
    {
      id: 1,
      name: "Dr. Raghav Rao",
      department: "CSE",
      email: "raghav.rao@gitam.in",
      qualifications: "Ph.D. in Computer Science, IISc Bangalore",
      officeHours: "Mon & Wed 2-4 PM",
      researchInterests: "Machine Learning, Distributed Systems",
      bio: "Dr. Rao has extensive experience in ML algorithms and high-performance computing."
    },
    {
      id: 2,
      name: "Prof. Neha Mehta",
      department: "CSE (AIML)",
      email: "neha.mehta@gitam.in",
      qualifications: "Ph.D. in Artificial Intelligence, IIT Bombay",
      officeHours: "Tue & Thu 10-12 AM",
      researchInterests: "Deep Learning, Natural Language Processing",
      bio: "Prof. Mehta focuses on cutting-edge AI techniques and language models."
    },
    {
      id: 3,
      name: "Dr. Anand Kulkarni",
      department: "CSE (DS)",
      email: "anand.kulkarni@gitam.in",
      qualifications: "Ph.D. in Data Science, IIIT Hyderabad",
      officeHours: "Fri 1-3 PM",
      researchInterests: "Big Data Analytics, Predictive Modeling",
      bio: "Dr. Kulkarni works on large-scale data infrastructures and analytics solutions."
    },
    {
      id: 4,
      name: "Dr. Shweta Iyer",
      department: "CSE (Cybersecurity)",
      email: "shweta.iyer@gitam.in",
      qualifications: "Ph.D. in Cybersecurity, IIT Madras",
      officeHours: "Wed 3-5 PM",
      researchInterests: "Network Security, Cryptography",
      bio: "Dr. Iyer investigates secure communication protocols and threat mitigation strategies."
    },
    {
      id: 5,
      name: "Prof. Arjun Varma",
      department: "ECE",
      email: "arjun.varma@gitam.in",
      qualifications: "Ph.D. in Electronics, NIT Surathkal",
      officeHours: "Mon & Fri 9-11 AM",
      researchInterests: "VLSI Design, Embedded Systems",
      bio: "Prof. Varma specializes in chip design and low-power embedded architectures."
    },
    {
      id: 6,
      name: "Dr. Kavita Sharma",
      department: "EEE",
      email: "kavita.sharma@gitam.in",
      qualifications: "Ph.D. in Electrical Engineering, IIT Kharagpur",
      officeHours: "Tue & Thu 1-3 PM",
      researchInterests: "Power Electronics, Smart Grids",
      bio: "Dr. Sharma explores efficient power distribution systems and renewable integration."
    },
    {
      id: 7,
      name: "Prof. Manish Gupta",
      department: "CSE (IoT)",
      email: "manish.gupta@gitam.in",
      qualifications: "Ph.D. in IoT Systems, IIIT Delhi",
      officeHours: "Wed & Fri 2-4 PM",
      researchInterests: "Edge Computing, Sensor Networks",
      bio: "Prof. Gupta studies scalable IoT architectures and real-time data processing."
    },
    {
      id: 8,
      name: "Dr. Ritu Singh",
      department: "MECH",
      email: "ritu.singh@gitam.in",
      qualifications: "Ph.D. in Mechanical Engineering, IIT Roorkee",
      officeHours: "Mon & Thu 3-5 PM",
      researchInterests: "Robotics, Advanced Manufacturing",
      bio: "Dr. Singh's interests lie in automation, robotics, and additive manufacturing methods."
    },
    {
      id: 9,
      name: "Prof. Aditya Nair",
      department: "AERO",
      email: "aditya.nair@gitam.in",
      qualifications: "Ph.D. in Aeronautical Engineering, IIST",
      officeHours: "Tue & Fri 10-12 AM",
      researchInterests: "Aerospace Propulsion, Flight Dynamics",
      bio: "Prof. Nair works on propulsion systems for UAVs and supersonic jet configurations."
    },
    {
      id: 10,
      name: "Dr. Pallavi Deshpande",
      department: "CSE",
      email: "pallavi.deshpande@gitam.in",
      qualifications: "Ph.D. in Computer Science, JNU Delhi",
      officeHours: "Mon & Wed 1-3 PM",
      researchInterests: "Software Engineering, DevOps",
      bio: "Dr. Deshpande focuses on software lifecycle management and agile methodologies."
    },
    {
      id: 11,
      name: "Prof. Vivek Srinivasan",
      department: "CSE (AIML)",
      email: "vivek.srinivasan@gitam.in",
      qualifications: "Ph.D. in Machine Learning, IISc Bangalore",
      officeHours: "Wed & Thu 11-1 PM",
      researchInterests: "Reinforcement Learning, Computer Vision",
      bio: "Prof. Srinivasan researches advanced RL algorithms for autonomous systems."
    },
    {
      id: 12,
      name: "Dr. Priya Chatterjee",
      department: "CSE (DS)",
      email: "priya.chatterjee@gitam.in",
      qualifications: "Ph.D. in Data Analytics, IIM Calcutta",
      officeHours: "Fri 9-11 AM",
      researchInterests: "Business Analytics, Data Visualization",
      bio: "Dr. Chatterjee applies data insights to organizational decision-making."
    },
    {
      id: 13,
      name: "Prof. Rohit Menon",
      department: "CSE (Cybersecurity)",
      email: "rohit.menon@gitam.in",
      qualifications: "Ph.D. in Information Security, IIIT Allahabad",
      officeHours: "Tue & Fri 2-4 PM",
      researchInterests: "Blockchain Security, Intrusion Detection",
      bio: "Prof. Menon investigates blockchain-based identity management and secure protocols."
    },
    {
      id: 14,
      name: "Dr. Sneha Banerjee",
      department: "ECE",
      email: "sneha.banerjee@gitam.in",
      qualifications: "Ph.D. in VLSI Design, IIT Madras",
      officeHours: "Mon & Wed 10-12 AM",
      researchInterests: "Low-Power Circuits, Analog IC Design",
      bio: "Dr. Banerjee works on energy-efficient integrated circuits for mobile devices."
    },
    {
      id: 15,
      name: "Prof. Hari Shankar",
      department: "EEE",
      email: "hari.shankar@gitam.in",
      qualifications: "Ph.D. in Electrical Machines, BITS Pilani",
      officeHours: "Thu & Fri 3-5 PM",
      researchInterests: "Electric Drives, Motor Control",
      bio: "Prof. Shankar develops control algorithms for high-efficiency electric motors."
    },
    {
      id: 16,
      name: "Dr. Madhuri Verma",
      department: "CSE (IoT)",
      email: "madhuri.verma@gitam.in",
      qualifications: "Ph.D. in IoT and Networks, IIIT Bangalore",
      officeHours: "Mon & Thu 4-6 PM",
      researchInterests: "IoT Security, Smart Home Systems",
      bio: "Dr. Verma ensures secure IoT deployments focusing on privacy and device authenticity."
    },
    {
      id: 17,
      name: "Prof. Sameer Patil",
      department: "MECH",
      email: "sameer.patil@gitam.in",
      qualifications: "Ph.D. in Mechanical Design, IIT Guwahati",
      officeHours: "Tue & Fri 1-3 PM",
      researchInterests: "CAD/CAM, Material Strength",
      bio: "Prof. Patil's research improves mechanical components design and fatigue analysis."
    },
    {
      id: 18,
      name: "Dr. Aditi Rao",
      department: "AERO",
      email: "aditi.rao@gitam.in",
      qualifications: "Ph.D. in Aerodynamics, IIT Kanpur",
      officeHours: "Wed & Fri 3-5 PM",
      researchInterests: "Aerodynamic Optimization, CFD",
      bio: "Dr. Rao uses CFD simulations to optimize wing shapes and reduce drag."
    },
    {
      id: 19,
      name: "Prof. Gaurav Joshi",
      department: "CSE",
      email: "gaurav.joshi@gitam.in",
      qualifications: "Ph.D. in Computer Science, DU Delhi",
      officeHours: "Mon & Wed 10-12 PM",
      researchInterests: "Databases, Cloud Computing",
      bio: "Prof. Joshi explores scalable database architectures and cloud-based services."
    },
    {
      id: 20,
      name: "Dr. Leena Naik",
      department: "CSE (AIML)",
      email: "leena.naik@gitam.in",
      qualifications: "Ph.D. in AI, Anna University",
      officeHours: "Thu & Fri 2-4 PM",
      researchInterests: "Explainable AI, Transfer Learning",
      bio: "Dr. Naik is focused on making AI models interpretable and reusable across domains."
    },
    // Add more faculty as needed
  ],
  stats: {
    student: [
      { title: 'Pending Requests', value: 2 },
      { title: 'Accepted Requests', value: 5 },
    ],
    teacher: [
      { title: 'Pending Approvals', value: 3 },
      { title: 'Total Accepted', value: 10 },
    ],
    admin: [
      { title: 'Total Users', value: 50 },
      { title: 'Pending Requests', value: 8 },
      { title: 'Accepted Requests', value: 25 },
    ],
  },
  tables: {
    studentPendingRequests: [
      ['REQ123', 'Pending', 'Dr. Smith', 'Recommendation for MS'],
      ['REQ124', 'Pending', 'Dr. Brown', 'Recommendation for Internship'],
    ],
    studentAcceptedRequests: [
      ['REQ125', 'Accepted', 'Dr. Smith', 'Recommendation for PhD'],
      ['REQ126', 'Accepted', 'Dr. Brown', 'Recommendation for Job Application'],
    ],
    teacherPendingRequests: [
      ['REQ127', 'John Doe', 'Recommendation for MS'],
      ['REQ128', 'Jane Doe', 'Recommendation for Internship'],
    ],
    teacherAcceptedRequests: [
      ['REQ129', 'John Smith', 'Recommendation for PhD'],
      ['REQ130', 'Jane Brown', 'Recommendation for Job Application'],
    ],
    adminManageUsers: [
      ['U123', 'student1', 'Student'],
      ['U124', 'teacher1', 'Teacher'],
      ['U125', 'admin', 'Admin'],
    ],
  },
  chartData: {
    labels: ['Pending', 'Accepted', 'Rejected'],
    datasets: [
      {
        label: 'LoR Requests',
        data: [8, 25, 5],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  },
};

export default dummyData;
