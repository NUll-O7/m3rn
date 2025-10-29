import { Link } from "react-router";
import { PlusIcon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

const Navbar = () => {
  const { isDark } = useTheme();

  return (
    <header
      className={`relative z-20 border-b-2 ${
        isDark 
          ? 'border-pink-500/30 bg-gray-900/80' 
          : 'border-pink-400/30 bg-white/80'
      } backdrop-blur-md ${
        isDark 
          ? 'shadow-[0_4px_20px_rgba(236,72,153,0.3)]' 
          : 'shadow-[0_4px_20px_rgba(236,72,153,0.2)]'
      }`}
    >
      <div className={`mx-auto max-w-6xl p-4`}>
        <div className="flex items-center justify-between">
          <Link to="/" className="group">
            <h1
              className={`text-3xl font-bold font-mono tracking-tight bg-linear-to-r ${
                isDark 
                  ? 'from-pink-400 via-purple-400 to-cyan-400' 
                  : 'from-pink-600 via-purple-600 to-cyan-600'
              } bg-clip-text text-transparent hover:scale-105 transition-transform duration-300`}
            >
              NoteDrive
            </h1>
            <div className={`h-0.5 bg-linear-to-r ${
              isDark 
                ? 'from-pink-500 via-purple-500 to-cyan-500' 
                : 'from-pink-600 via-purple-600 to-cyan-600'
            } scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              to="/create"
              className="relative group px-4 py-2 font-bold tracking-wider text-white text-sm uppercase overflow-hidden rounded-lg flex items-center gap-2"
            >
              <div className={`absolute inset-0 bg-linear-to-r ${
                isDark 
                  ? 'from-pink-500 via-purple-500 to-cyan-500' 
                  : 'from-pink-600 via-purple-600 to-cyan-600'
              } group-hover:scale-110 transition-transform duration-300`}></div>
              <div className={`absolute inset-0 bg-linear-to-r ${
                isDark 
                  ? 'from-pink-500 via-purple-500 to-cyan-500' 
                  : 'from-pink-600 via-purple-600 to-cyan-600'
              } blur-md opacity-50 group-hover:opacity-75 transition-opacity duration-300`}></div>
              <PlusIcon className="w-5 h-5 relative z-10" />
              <span className="relative z-10">New Note</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;