import Note from '../models/Notes.js';

export const getAllNotes = async (req, res) => {
    try{
        const Notes = await Note.find();
        res.status(200).json(Notes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching notes" });
        console.error(error);
    }
};

export const createNote = (req, res) => {
    res.status(201).send("Note created");
};

export const getNoteById = (req, res) => {
    const { id } = req.params;
    res.status(200).send(`Get note with ID: ${id}`);
};

export const updateNote = (req, res) => {
    const { id } = req.params;
    res.status(200).send(`Update note with ID: ${id}`);
};

export const deleteNote = (req, res) => {
    const { id } = req.params;
    res.status(200).send(`Delete note with ID: ${id}`);
};
