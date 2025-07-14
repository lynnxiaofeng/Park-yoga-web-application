require('dotenv').config(); // Load environment variables from .env
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
var path = require('path');
var fs = require('fs');
var morgan = require('morgan');
const apiRouter = require("./src/routes/index");

const app = express();
var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

//setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

// Connect to MongoDB
const mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/yoga-app";

mongoose.connect(mongoDB)
  .then(() => console.log("MongoDB connected successfully"))
  .catch(err => console.error("MongoDB connection error:", err));

// Middleware for parsing JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE',`OPTIONS`],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));

// Example test route (optional)
app.get('/', (req, res) => {
  res.send('Hello, Welcome to IFN666 Assessment02!!');
});

// API routes
app.use("/api", apiRouter);

// Start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
