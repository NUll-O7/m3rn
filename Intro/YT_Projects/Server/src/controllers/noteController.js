export const getAllNotes = (req, res) => {
    res.status(200).send("Got all the notes");
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
