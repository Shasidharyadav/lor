const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise'); // Use MySQL database library

// Database connection (update with your database credentials)
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'demo', // Replace with your database name
};

// Function to add a student to the `student_users` table
async function addUser(id, name, email, phone, campus, department, password) {
  try {
    // Connect to the database
    const connection = await mysql.createConnection(dbConfig);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL query to insert student into the `student_users` table
    const sql = `
      INSERT INTO student_users (id, name, email, phone, campus, department, password)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // Execute the query
    await connection.execute(sql, [
      id,
      name,
      email,
      phone,
      campus,
      department,
      hashedPassword,
    ]);

    console.log(`Student ${name} (${email}) added successfully to student_users!`);
    await connection.end();
  } catch (error) {
    console.error('Error adding student:', error.message);
  }
}

// Add new random students here
(async () => {
  await addUser('ST201', 'Aakash Verma', 'aakash.verma@gitam.in', '9876543301', 'Hyderabad', 'CSE', 'Test@123');
  await addUser('ST202', 'Priyanka Mehta', 'priyanka.mehta@gitam.edu', '9876543302', 'Bangalore', 'ECE', 'Test@123');
  await addUser('ST203', 'Siddharth Nair', 'siddharth.nair@gitam.in', '9876543303', 'Visakhapatnam', 'Civil', 'Test@123');
  await addUser('ST204', 'Nisha Kulkarni', 'nisha.kulkarni@gitam.edu', '9876543304', 'Hyderabad', 'Mech', 'Test@123');
  await addUser('ST205', 'Rohan Gupta', 'rohan.gupta@gitam.in', '9876543305', 'Bangalore', 'CSE Specializations', 'Test@123');
  await addUser('ST206', 'Anjali Sharma', 'anjali.sharma@gitam.edu', '9876543306', 'Visakhapatnam', 'ECE', 'Test@123');
  await addUser('ST207', 'Kunal Desai', 'kunal.desai@gitam.in', '9876543307', 'Hyderabad', 'Civil', 'Test@123');
  await addUser('ST208', 'Sneha Mishra', 'sneha.mishra@gitam.edu', '9876543308', 'Bangalore', 'Mech', 'Test@123');
  await addUser('ST209', 'Rahul Singh', 'rahul.singh@gitam.in', '9876543309', 'Visakhapatnam', 'CSE', 'Test@123');
  await addUser('ST210', 'Pooja Nair', 'pooja.nair@gitam.edu', '9876543310', 'Hyderabad', 'ECE', 'Test@123');
  await addUser('ST211', 'Tanmay Joshi', 'tanmay.joshi@gitam.in', '9876543311', 'Bangalore', 'Mech', 'Test@123');
  await addUser('ST212', 'Aditi Iyer', 'aditi.iyer@gitam.edu', '9876543312', 'Visakhapatnam', 'CSE Specializations', 'Test@123');
  await addUser('ST213', 'Arjun Das', 'arjun.das@gitam.in', '9876543313', 'Hyderabad', 'Civil', 'Test@123');
  await addUser('ST214', 'Riya Patil', 'riya.patil@gitam.edu', '9876543314', 'Bangalore', 'ECE', 'Test@123');
  await addUser('ST215', 'Varun Reddy', 'varun.reddy@gitam.in', '9876543315', 'Visakhapatnam', 'Mech', 'Test@123');
  await addUser('ST216', 'Deepika Shah', 'deepika.shah@gitam.edu', '9876543316', 'Hyderabad', 'CSE', 'Test@123');
  await addUser('ST217', 'Suresh Kumar', 'suresh.kumar@gitam.in', '9876543317', 'Bangalore', 'Civil', 'Test@123');
  await addUser('ST218', 'Ishita Tiwari', 'ishita.tiwari@gitam.edu', '9876543318', 'Visakhapatnam', 'CSE Specializations', 'Test@123');
  await addUser('ST219', 'Karthik Menon', 'karthik.menon@gitam.in', '9876543319', 'Hyderabad', 'ECE', 'Test@123');
  await addUser('ST220', 'Ritika Agarwal', 'ritika.agarwal@gitam.edu', '9876543320', 'Bangalore', 'Mech', 'Test@123');

  console.log('All students added successfully!');
})();
