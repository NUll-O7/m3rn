// # Project 1: Comprehensive Task Manager API (Level 3)

// This project implements a complete task manager API with advanced filtering, validation, and error handling using Express (in-memory data store).

// ## Key Concepts Covered
// - Express routing (GET, POST, PATCH, DELETE)
// - Request validation middleware
// - Advanced query parameters (filtering, sorting)
// - Proper HTTP status codes
// - Error handling patterns

const express = require('express');
const app = express();
const taskRoutes = require('./routes/taskRoutes.js');
app.listen(3000, () => console.log('Server running on port 3000'));

app.use(express.json());

app.use('/api', taskRoutes);