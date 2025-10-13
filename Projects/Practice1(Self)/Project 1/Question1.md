# Project 1: Comprehensive Task Manager API (Level 3)

This project implements a complete task manager API with advanced filtering, validation, and error handling using Express (in-memory data store).

## Key Concepts Covered
- Express routing (GET, POST, PATCH, DELETE)
- Request validation middleware
- Advanced query parameters (filtering, sorting)
- Proper HTTP status codes
- Error handling patterns

## Code Implementation

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory database with validation rules
let tasks = [{ id: 1, title: 'Example Task', description: 'Details here', priority: 'medium', completed: false, due: '2025-12-31' }];
let currentId = 2;

// Custom validation middleware
const validateTask = (req, res, next) => {
  const { title, priority } = req.body;
  
  if (!title || title.trim().length < 3) {
    return res.status(400).json({ error: 'Title must be at least 3 characters long' });
  }
  
  if (priority && !['low', 'medium', 'high'].includes(priority)) {
    return res.status(400).json({ error: "Priority must be 'low', 'medium', or 'high'" });
  }
  
  next();
};

// Advanced query processing (filtering, sorting)
app.get('/tasks', (req, res) => {
  let result = [...tasks];
  
  // Filter by completion status
  if (req.query.completed) {
    const isCompleted = req.query.completed === 'true';
    result = result.filter(task => task.completed === isCompleted);
  }
  
  // Filter by priority
  if (req.query.priority) {
    result = result.filter(task => task.priority === req.query.priority);
  }
  
  // Sort functionality
  if (req.query.sort) {
    const [field, order] = req.query.sort.split('_');
    result.sort((a, b) => {
      return order === 'desc' ? b[field].localeCompare(a[field]) : a[field].localeCompare(b[field]);
    });
  }
  
  res.json(result);
});

app.post('/tasks', validateTask, (req, res) => {
  const newTask = {
    id: currentId++,
    title: req.body.title,
    description: req.body.description || '',
    priority: req.body.priority || 'medium',
    completed: false,
    created: new Date().toISOString(),
    due: req.body.due || null
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({ error: `Task with ID ${id} not found` });
  }
  
  res.json(task);
});

app.patch('/tasks/:id', validateTask, (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${id} not found` });
  }
  
  // Only update allowed fields
  const allowedFields = ['title', 'description', 'priority', 'completed', 'due'];
  const updatedTask = { ...tasks[taskIndex] };
  
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updatedTask[field] = req.body[field];
    }
  }
  
  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task with ID ${id} not found` });
  }
  
  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Testing the API

1. **Get All Tasks**
   ```
   GET /tasks
   ```

2. **Get Completed Tasks**
   ```
   GET /tasks?completed=true
   ```

3. **Get High Priority Tasks**
   ```
   GET /tasks?priority=high
   ```

4. **Sort Tasks by Title (A-Z)**
   ```
   GET /tasks?sort=title_asc
   ```

5. **Create a New Task**
   ```
   POST /tasks
   {
     "title": "Learn Express",
     "description": "Master Express.js for the exam",
     "priority": "high",
     "due": "2025-10-15"
   }
   ```

6. **Update a Task**
   ```
   PATCH /tasks/1
   {
     "completed": true
   }
   ```

7. **Delete a Task**
   ```
   DELETE /tasks/1
   ```

## Key Learning Points

- Implementing custom middleware for validation
- Handling query parameters for filtering and sorting
- Properly structuring PATCH routes to update only allowed fields
- Using appropriate HTTP status codes (201 for creation, 204 for deletion)
- Implementing proper error responses with status codes