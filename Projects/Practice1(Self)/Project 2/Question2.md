# Project 2: Library Management System with Advanced Validation (Level 4)

This project implements a library management system with MongoDB/Mongoose, focusing on advanced schema validation, custom methods, and comprehensive error handling.

## Key Concepts Covered
- MongoDB connection with Mongoose
- Advanced schema validation (required fields, min/max, regex)
- Schema virtuals and custom methods
- Global error handling with custom status codes
- Query parameters and filtering
- Proper HTTP status codes

## Code Implementation

```javascript
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.use(express.json());
mongoose.connect('mongodb://localhost:27017/libraryDB');

// Advanced schema with validation, custom methods and virtuals
const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true,
    minlength: [2, 'Title must be at least 2 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'ISBN is required'],
    unique: true,
    validate: {
      validator: function(v) {
        // Basic ISBN validation (simplified)
        return /^[0-9-]{10,17}$/.test(v);
      },
      message: props => `${props.value} is not a valid ISBN!`
    }
  },
  publishYear: {
    type: Number,
    min: [1000, 'Year must be after 1000'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  genres: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length > 0;
      },
      message: 'At least one genre must be specified'
    }
  },
  available: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null
  }
}, {
  timestamps: true
});

// Virtual property for book age
bookSchema.virtual('age').get(function() {
  return new Date().getFullYear() - this.publishYear;
});

// Custom method
bookSchema.methods.makeUnavailable = function() {
  this.available = false;
  return this.save();
};

// Static method for finding by genre
bookSchema.statics.findByGenre = function(genre) {
  return this.find({ genres: genre });
};

const Book = mongoose.model('Book', bookSchema);

// Centralized error handler
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Routes with proper status codes and error handling
app.post('/books', asyncHandler(async (req, res) => {
  const book = await Book.create(req.body);
  res.status(201).json(book);
}));

app.get('/books', asyncHandler(async (req, res) => {
  const { genre, available, minYear, maxYear, sort } = req.query;
  
  // Build query
  const query = {};
  if (genre) query.genres = genre;
  if (available) query.available = available === 'true';
  if (minYear || maxYear) {
    query.publishYear = {};
    if (minYear) query.publishYear.$gte = parseInt(minYear);
    if (maxYear) query.publishYear.$lte = parseInt(maxYear);
  }
  
  // Build sort
  const sortOptions = {};
  if (sort) {
    const [field, direction] = sort.split('_');
    sortOptions[field] = direction === 'desc' ? -1 : 1;
  }
  
  const books = await Book.find(query).sort(sortOptions);
  res.json(books);
}));

app.get('/books/:isbn', asyncHandler(async (req, res) => {
  const book = await Book.findOne({ isbn: req.params.isbn });
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
}));

app.patch('/books/:isbn', asyncHandler(async (req, res) => {
  const book = await Book.findOneAndUpdate(
    { isbn: req.params.isbn }, 
    req.body,
    { new: true, runValidators: true }
  );
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json(book);
}));

app.delete('/books/:isbn', asyncHandler(async (req, res) => {
  const book = await Book.findOneAndDelete({ isbn: req.params.isbn });
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.status(204).send();
}));

// Custom method route
app.patch('/books/:isbn/checkout', asyncHandler(async (req, res) => {
  const book = await Book.findOne({ isbn: req.params.isbn });
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  if (!book.available) {
    return res.status(400).json({ error: 'Book is already checked out' });
  }
  
  await book.makeUnavailable();
  res.json(book);
}));

// Static method route
app.get('/genre/:genreName/books', asyncHandler(async (req, res) => {
  const books = await Book.findByGenre(req.params.genreName);
  res.json(books);
}));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: Object.values(err.errors).map(e => e.message) 
    });
  }
  
  // Handle duplicate key errors
  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate data detected' });
  }
  
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

## Testing the API

1. **Create a New Book**
   ```
   POST /books
   {
     "title": "Clean Code",
     "author": "Robert C. Martin",
     "isbn": "978-0132350884",
     "publishYear": 2008,
     "genres": ["Programming", "Software Engineering"],
     "rating": 4.5
   }
   ```

2. **Get All Books**
   ```
   GET /books
   ```

3. **Get Books with Filters**
   ```
   GET /books?genre=Programming&available=true&minYear=2000&sort=publishYear_desc
   ```

4. **Get Book by ISBN**
   ```
   GET /books/978-0132350884
   ```

5. **Update a Book**
   ```
   PATCH /books/978-0132350884
   {
     "rating": 5,
     "genres": ["Programming", "Software Engineering", "Best Practices"]
   }
   ```

6. **Check out a Book (Custom Method)**
   ```
   PATCH /books/978-0132350884/checkout
   ```

7. **Get Books by Genre (Static Method)**
   ```
   GET /genre/Programming/books
   ```

8. **Delete a Book**
   ```
   DELETE /books/978-0132350884
   ```

## Key Learning Points

- Advanced schema validation with Mongoose
- Creating virtual properties (age) calculated from schema fields
- Implementing custom instance methods (makeUnavailable)
- Creating static methods (findByGenre) for models
- Using asyncHandler to handle promise rejections uniformly
- Building advanced query filters from URL parameters
- Global error handling for Mongoose validation errors