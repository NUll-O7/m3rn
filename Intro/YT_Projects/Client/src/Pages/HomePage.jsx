import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import Navbar from "../Components/Navbar.jsx";
import RateLimitedUI from "../Components/RateLimitedUI.jsx";
import NoteCard from "../Components/NoteCard.jsx";
import NotesAPI from "../lib/axios.js";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await NotesAPI.get("/notes");
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response && error.response.status === 429) {
          setIsRateLimited(true);
          toast.error("You are being rate limited. Please try again later.");
        } else {
          toast.error("Failed to fetch notes. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-4">
        {isRateLimited && <RateLimitedUI />}
        <div className="max-w-7xl mx-auto p-4 mt-6">
          {loading ? (
            <p className="text-center text-primary py-10">Loading notes...</p>
          ) : notes.length === 0 ? (
            <p className="text-center text-primary py-10">
              No notes available.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
