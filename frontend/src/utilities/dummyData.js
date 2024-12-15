const dummyData = {
  users: [
    { userId: 'U123', username: 'student1', password: 'password123', role: 'student' },
    { userId: 'U124', username: 'teacher1', password: 'password456', role: 'teacher' },
    { userId: 'U125', username: 'admin', password: 'adminpass', role: 'admin' },
  ],
  stats: {
    student: [
      { title: 'Pending Requests', value: 2 },
      { title: 'Accepted Requests', value: 5 },
    ],
    teacher: [
      { title: 'Pending Approvals', value: 3 },
      { title: 'Total Approved', value: 10 },
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
