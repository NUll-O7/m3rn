import Note from '../models/Notes.js';

export const getAllNotes = async (req, res) => {
    try{
        const Notes = await Note.find().sort({createdAt: -1});
        res.status(200).json(Notes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notes" });
        console.error(error);
    }
};

export const createNote = async (req, res) => {
    try{
        const {title, content} = req.body;
        const newNote = new Note({ title, content });
        await newNote.save();
        res.status(201).json({
            message: "Note created successfully",
            note: newNote
        });
    }catch (error) {
        res.status(500).json({ message: "Error creating note" });
        console.error(error);
    }
};

export const updateNote = async (req, res) => {
    try {
        const {title, content} = req.body;
        const note = await Note.findByIdAndUpdate(req.params.id, {title, content}, {new: true});
        if(!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({
            message: "Note updated successfully",
            note
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching note" });
        console.error(error);
    }
};

export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);
        if(!note) return res.status(404).json({message:"Note Not found!"})
    } catch (error) {
        
    }
    res.status(200).send(`Update note with ID: ${id}`);
};

export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).json({ message: "Note not found" });
        }
        res.status(200).json({ message: "Note deleted successfully", note  });
    } catch (error) {
        res.status(500).json({ message: "Error deleting note" });
        console.error(error);
    }
};
