import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext.jsx";

const NoteCard = ({ note, setNotes }) => {
  const { isDark } = useTheme();
  
  const handleDelete = async (e, id) => {
    e.preventDefault(); // get rid of the navigation behaviour

    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      await api.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id)); // get rid of the deleted one
      toast.success("Note deleted successfully");
    } catch (error) {
      console.log("Error in handleDelete", error);
      toast.error("Failed to delete note");
    }
  };

  return (
    <Link
      to={`/note/${note._id}`}
      className="relative group block"
    >
      {/* Hover glow effect */}
      <div className={`absolute inset-0 bg-linear-to-r ${
        isDark 
          ? 'from-pink-500 via-purple-500 to-cyan-500' 
          : 'from-pink-400 via-purple-400 to-cyan-400'
      } rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
      
      {/* Card */}
      <div className={`relative ${
        isDark 
          ? 'bg-gray-900/90' 
          : 'bg-white/90'
      } backdrop-blur-sm rounded-xl border-t-4 border-[#00FF9D] border-x-2 border-b-2 ${
        isDark 
          ? 'border-x-purple-500 border-b-purple-500 group-hover:border-x-pink-500 group-hover:border-b-pink-500' 
          : 'border-x-purple-400 border-b-purple-400 group-hover:border-x-pink-400 group-hover:border-b-pink-400'
      } ${
        isDark 
          ? 'shadow-[0_0_15px_rgba(168,85,247,0.3)] group-hover:shadow-[0_0_25px_rgba(236,72,153,0.5)]' 
          : 'shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]'
      } transition-all duration-200`}>
        <div className="p-6">
          <h3 className={`text-xl font-bold text-transparent bg-linear-to-r ${
            isDark 
              ? 'from-pink-400 to-cyan-400' 
              : 'from-pink-600 to-cyan-600'
          } bg-clip-text mb-3 tracking-wide`}>
            {note.title}
          </h3>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'} line-clamp-3 mb-4`}>
            {note.content}
          </p>
          <div className={`flex justify-between items-center mt-4 pt-4 border-t ${
            isDark ? 'border-purple-500/30' : 'border-purple-400/30'
          }`}>
            <span className={`text-sm ${
              isDark ? 'text-cyan-400' : 'text-cyan-600'
            } font-mono tracking-wider`}>
              {formatDate(new Date(note.createdAt))}
            </span>
            <div className="flex items-center gap-1">
              <PenSquareIcon className={`w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-cyan-600'}`} />
              <button
                className={`p-1 ${
                  isDark 
                    ? 'text-red-400 hover:text-red-300 hover:bg-red-500/20' 
                    : 'text-red-500 hover:text-red-400 hover:bg-red-400/20'
                } rounded transition-colors duration-200`}
                onClick={(e) => handleDelete(e, note._id)}
              >
                <Trash2Icon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NoteCard;