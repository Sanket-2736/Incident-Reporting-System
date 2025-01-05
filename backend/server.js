require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db'); // Import MongoDB connection function
const mongoose = require('mongoose');
const multer = require('multer')

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer();
app.use(upload.array('attachments'));

// Middleware for serving static files
app.use('/uploads', express.static('uploads')); // Serve uploaded images

// Basic Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Incident Reporting API');
});

// Example route import
const reportRoutes = require('./routes/reportRoutes'); // Adjust the path as needed
app.use('/api/reports', reportRoutes); // Use report routes

const authRoutes = require('./routes/authRoutes');
app.use("/api/auth", authRoutes); // Correct usage for auth routes

const categoryRoutes = require('./routes/categoryRoutes');
app.use("/api/categories", categoryRoutes); // Changed to /api/categories

const incidentRoutes = require('./routes/incidentRoutes');
app.use("/api/incidents", incidentRoutes); // Changed to /api/incidents

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  await mongoose.connection.close();
  process.exit(0);
});
