import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import RateLimitedUI from "../components/RateLimitedUI";
import NoteCard from "../components/NoteCard";
import NotesNotFound from "../components/NotesNotFound";
import api from "../lib/axios";
import toast from "react-hot-toast";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res.data);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.log("Error fetching notes");
        console.log(error.response);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-b from-purple-900 via-pink-900 to-orange-900">
      {/* Animated grid background */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.3) 2px, transparent 2px),
                           linear-gradient(90deg, rgba(236, 72, 153, 0.3) 2px, transparent 2px)`,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top'
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="fixed top-20 left-20 w-96 h-96 bg-pink-500 rounded-full blur-[128px] opacity-30 animate-pulse pointer-events-none"></div>
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full blur-[128px] opacity-30 animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}></div>
      <div className="fixed top-1/2 left-1/2 w-96 h-96 bg-purple-500 rounded-full blur-[128px] opacity-20 animate-pulse pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <div className="max-w-7xl mx-auto p-4 mt-6 relative z-10">
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block">
              <div className="text-3xl font-bold bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-wider animate-pulse">
                LOADING NOTES...
              </div>
              <div className="mt-4 flex justify-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}

        {notes.length === 0 && !isRateLimited && !loading && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>

      {/* Scanline effect */}
      <div className="pointer-events-none fixed inset-0 bg-linear-to-b from-transparent via-pink-500/5 to-transparent animate-[scan_8s_linear_infinite]" style={{
        backgroundSize: '100% 200%',
        animation: 'scan 8s linear infinite'
      }}></div>

      <style>{`
        @keyframes scan {
          0% {
            background-position: 0% 0%;
          }
          100% {
            background-position: 0% 200%;
          }
        }
      `}</style>
    </div>
  );
};

export default HomePage;