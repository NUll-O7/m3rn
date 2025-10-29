import { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeft, Loader, Trash2 } from "lucide-react";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        setNote(res.data);
      } catch (error) {
        console.log("Error in fetching note", error);
        toast.error("Failed to fetch the note");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted");
      navigate("/");
    } catch (error) {
      console.log("Error deleting the note:", error);
      toast.error("Failed to delete note");
    }
  };

  const handleSave = async () => {
    if (!note.title.trim() || !note.content.trim()) {
      toast.error("Please add a title or content");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/notes/${id}`, note);
      toast.success("Note updated successfully");
      navigate("/");
    } catch (error) {
      console.log("Error saving the note:", error);
      toast.error("Failed to update note");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-purple-900 via-pink-900 to-orange-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, cyan 2px, cyan 4px)',
          backgroundSize: '50px 50px'
        }}></div>
        <Loader className="animate-spin size-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] relative z-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-purple-900 via-pink-900 to-orange-900 relative overflow-hidden">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, cyan 2px, cyan 4px), repeating-linear-gradient(90deg, transparent, transparent 2px, cyan 2px, cyan 4px)',
        backgroundSize: '50px 50px',
        animation: 'gridScroll 20s linear infinite'
      }}></div>
      
      {/* Sun/glow effect */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-30"></div>

      <style>{`
        @keyframes gridScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        @keyframes neonPulse {
          0%, 100% { filter: drop-shadow(0 0 5px currentColor) drop-shadow(0 0 10px currentColor); }
          50% { filter: drop-shadow(0 0 10px currentColor) drop-shadow(0 0 20px currentColor); }
        }
        .neon-border {
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.5), 0 0 20px rgba(236, 72, 153, 0.3), inset 0 0 10px rgba(34, 211, 238, 0.2);
        }
        .neon-text {
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
        }
      `}</style>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Link 
              to="/" 
              className="group flex items-center gap-2 px-4 py-2 bg-black/50 border-2 border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all duration-300 font-bold backdrop-blur-sm neon-border"
            >
              <ArrowLeft className="h-5 w-5 group-hover:animate-pulse" style={{ animation: 'neonPulse 2s ease-in-out infinite' }} />
              BACK TO NOTES
            </Link>
            <button 
              onClick={handleDelete} 
              className="group flex items-center gap-2 px-4 py-2 bg-black/50 border-2 border-pink-500 text-pink-500 rounded-lg hover:bg-pink-500/10 transition-all duration-300 font-bold backdrop-blur-sm"
              style={{ boxShadow: '0 0 10px rgba(236, 72, 153, 0.5), 0 0 20px rgba(236, 72, 153, 0.3)' }}
            >
              <Trash2 className="h-5 w-5 group-hover:animate-pulse" />
              DELETE NOTE
            </button>
          </div>

          <div className="bg-black/60 backdrop-blur-md rounded-2xl border-2 border-cyan-400 neon-border overflow-hidden">
            <div className="p-8">
              {/* Decorative header bar */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b-2 border-pink-500/50">
                <div className="w-3 h-3 rounded-full bg-pink-500 animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>

              <div className="mb-6">
                <label className="block mb-2">
                  <span className="text-cyan-400 font-bold text-sm uppercase tracking-wider neon-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter your title..."
                  className="w-full px-4 py-3 bg-black/50 border-2 border-pink-500/50 text-white placeholder-gray-400 rounded-lg focus:border-cyan-400 focus:outline-none transition-all duration-300 font-mono backdrop-blur-sm"
                  style={{ boxShadow: '0 0 5px rgba(236, 72, 153, 0.3), inset 0 0 5px rgba(0, 0, 0, 0.5)' }}
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2">
                  <span className="text-cyan-400 font-bold text-sm uppercase tracking-wider neon-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note in the neon glow..."
                  className="w-full px-4 py-3 bg-black/50 border-2 border-pink-500/50 text-white placeholder-gray-400 rounded-lg focus:border-cyan-400 focus:outline-none transition-all duration-300 font-mono backdrop-blur-sm resize-none"
                  style={{ boxShadow: '0 0 5px rgba(236, 72, 153, 0.3), inset 0 0 5px rgba(0, 0, 0, 0.5)' }}
                  rows="10"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>

              <div className="flex justify-end">
                <button 
                  className="group relative px-8 py-3 bg-linear-to-r from-pink-500 to-cyan-400 text-black font-bold rounded-lg hover:from-pink-400 hover:to-cyan-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider overflow-hidden"
                  disabled={saving} 
                  onClick={handleSave}
                  style={{ boxShadow: '0 0 20px rgba(236, 72, 153, 0.6), 0 0 40px rgba(34, 211, 238, 0.4)' }}
                >
                  <span className="relative z-10">
                    {saving ? "SAVING..." : "SAVE CHANGES"}
                  </span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default NoteDetailPage;