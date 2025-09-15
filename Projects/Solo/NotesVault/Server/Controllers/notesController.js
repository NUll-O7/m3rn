const Note = require('../models/Note');

// Get notes (optionally filtered by tag)
exports.getNotes = async (req, res) => {
  try {
    const { tag, userId } = req.query;
    const query = { userId };
    if (tag) query.tags = tag;
    const notes = await Note.find(query).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create note
exports.createNote = async (req, res) => {
  try {
    const { title, content, tags, userId } = req.body;
    const note = await Note.create({ title, content, tags, userId });
    res.status(201).json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(note);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};