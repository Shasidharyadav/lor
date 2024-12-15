require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const { createTables } = require('./models/userModel');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin (React app)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  credentials: true, // Allow cookies and authentication headers
}));

// Initialize Database
(async () => {
    try {
      await createTables();
      console.log('Tables initialized');
    } catch (err) {
      console.error('Error initializing tables:', err.message);
      process.exit(1);
    }
  })();
  

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Test Endpoint
app.get('/', (req, res) => res.send('LoR Management Backend Running'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Internal Server Error' });
});

// Start the Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
