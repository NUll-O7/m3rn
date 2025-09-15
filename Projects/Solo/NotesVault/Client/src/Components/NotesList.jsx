import React, { useEffect, useState } from "react";
import { fetchNotes } from "../services/noteService";
import TagCloud from "./TagCloud";

export default function NotesList({ userId }) {
  const [notes, setNotes] = useState([]);
  const [tagFilter, setTagFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchNotes({ tag: tagFilter, userId }).then(setNotes);
  }, [tagFilter, userId]);

  const filtered = notes.filter(
    note =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  const allTags = Array.from(new Set(notes.flatMap(n => n.tags)));

  return (
    <div>
      <input
        placeholder="Search notes"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <TagCloud tags={allTags} onSelect={setTagFilter} selected={tagFilter} />
      <div className="notes-grid">
        {filtered.map(note => (
          <div key={note._id} className="note-card">
            <h3>{note.title}</h3>
            <div>{note.tags.join(", ")}</div>
            <div>{new Date(note.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
