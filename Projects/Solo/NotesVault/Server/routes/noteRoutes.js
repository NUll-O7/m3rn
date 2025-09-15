const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

// GET /notes?tag=work&userId=xxx
router.get('/', noteController.getNotes);
// POST /notes
router.post('/', noteController.createNote);
// PATCH /notes/:id
router.patch('/:id', noteController.updateNote);
// DELETE /notes/:id
router.delete('/:id', noteController.deleteNote);

module.exports = router;