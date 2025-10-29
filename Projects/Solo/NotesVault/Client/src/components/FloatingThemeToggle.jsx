import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

export const FloatingThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <style>{`
        @keyframes orbitSun {
          0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(20px) rotate(-360deg); }
        }
        @keyframes orbitMoon {
          0% { transform: rotate(0deg) translateX(20px) rotate(0deg); }
          100% { transform: rotate(-360deg) translateX(20px) rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .neon-toggle {
          box-shadow: 0 0 10px currentColor, 0 0 20px currentColor, inset 0 0 10px rgba(0,0,0,0.3);
        }
        .floating-button {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <button
        onClick={toggleTheme}
        className={`floating-button group relative p-3 rounded-xl border-2 transition-all duration-500 backdrop-blur-sm overflow-hidden ${
          isDark 
            ? 'bg-black/60 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:scale-110' 
            : 'bg-white/80 border-yellow-400 text-yellow-500 hover:bg-yellow-400/10 hover:scale-110'
        } neon-toggle`}
        aria-label="Toggle theme"
      >
        {/* Background glow */}
        <div className={`absolute inset-0 transition-opacity duration-500 blur-xl ${
          isDark ? 'bg-cyan-400/20' : 'bg-yellow-400/20'
        } opacity-0 group-hover:opacity-100`}></div>

        {/* Icon container */}
        <div className="relative w-6 h-6">
          {/* Moon (Dark Mode) */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'
          }`}>
            <Moon className="w-6 h-6" style={{ 
              filter: 'drop-shadow(0 0 5px currentColor)'
            }} />
          </div>

          {/* Sun (Light Mode) */}
          <div className={`absolute inset-0 transition-all duration-500 ${
            !isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-180 scale-0'
          }`}>
            <Sun className="w-6 h-6" style={{ 
              filter: 'drop-shadow(0 0 5px currentColor)'
            }} />
          </div>
        </div>

        {/* Orbiting particle */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rounded-full ${
          isDark ? 'bg-cyan-400' : 'bg-yellow-400'
        }`} style={{
          animation: isDark ? 'orbitMoon 3s linear infinite' : 'orbitSun 3s linear infinite'
        }}></div>

        {/* Corner accents */}
        <div className={`absolute top-0.5 left-0.5 w-2 h-2 border-t border-l transition-colors ${
          isDark ? 'border-pink-500' : 'border-orange-500'
        }`}></div>
        <div className={`absolute bottom-0.5 right-0.5 w-2 h-2 border-b border-r transition-colors ${
          isDark ? 'border-pink-500' : 'border-orange-500'
        }`}></div>
      </button>
    </div>
  );
};