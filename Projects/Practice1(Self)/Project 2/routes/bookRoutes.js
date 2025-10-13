const router = require('express').router();
const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');

router.post('/books', asyncHandler(async (req, res) => {
    const book = await Book.create(req.body);
    res.status(201).json(book);
}));
