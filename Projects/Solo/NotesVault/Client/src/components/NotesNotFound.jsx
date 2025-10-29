import { Notebook } from "lucide-react";
import { Link } from "react-router";

const NotesNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8 max-w-md mx-auto text-center relative">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes neonPulse {
          0%, 100% { 
            filter: drop-shadow(0 0 10px currentColor) drop-shadow(0 0 20px currentColor);
            opacity: 1;
          }
          50% { 
            filter: drop-shadow(0 0 20px currentColor) drop-shadow(0 0 40px currentColor);
            opacity: 0.8;
          }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .neon-glow {
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.5), 0 0 40px rgba(236, 72, 153, 0.3), inset 0 0 20px rgba(34, 211, 238, 0.2);
        }
        .text-glow {
          text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 30px currentColor;
        }
      `}</style>

      {/* Floating icon container */}
      <div 
        className="relative bg-gradient-to-br from-cyan-500/20 to-pink-500/20 rounded-full p-12 border-2 border-cyan-400 neon-glow backdrop-blur-sm"
        style={{ animation: 'float 3s ease-in-out infinite' }}
      >
        {/* Scanline effect */}
        <div className="absolute inset-0 overflow-hidden rounded-full opacity-20">
          <div 
            className="absolute w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            style={{ animation: 'scanline 3s linear infinite' }}
          ></div>
        </div>
        
        {/* Icon */}
        <Notebook 
          className="size-16 text-cyan-400 relative z-10" 
          style={{ animation: 'neonPulse 2s ease-in-out infinite' }}
        />
        
        {/* Corner accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-pink-500"></div>
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-pink-500"></div>
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-pink-500"></div>
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-pink-500"></div>
      </div>

      {/* Title */}
      <h3 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 text-glow uppercase tracking-wider">
        No Notes Yet
      </h3>

      {/* Description */}
      <div className="relative">
        <p className="text-cyan-100 text-lg leading-relaxed font-mono px-4">
          <span className="text-pink-400">{'>'}</span> Ready to organize your thoughts?{' '}
          <span className="text-cyan-400 font-bold">Create</span> your first note to get started on your{' '}
          <span className="text-pink-400 font-bold">journey</span>.
        </p>
        
        {/* Decorative line */}
        <div className="mt-4 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
      </div>

      {/* CTA Button */}
      <Link 
        to="/create" 
        className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-cyan-400 text-black font-bold rounded-lg hover:from-pink-400 hover:to-cyan-300 transition-all duration-300 uppercase tracking-wider overflow-hidden text-lg"
        style={{ boxShadow: '0 0 20px rgba(236, 72, 153, 0.6), 0 0 40px rgba(34, 211, 238, 0.4)' }}
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-2xl">{'▶'}</span>
          Create Your First Note
        </span>
        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
        
        {/* Animated border */}
        <div className="absolute inset-0 border-2 border-white opacity-0 group-hover:opacity-100 rounded-lg transition-opacity duration-300"></div>
      </Link>

      {/* Bottom accent lines */}
      <div className="flex gap-2 items-center mt-4">
        <div className="w-8 h-0.5 bg-pink-500"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="w-12 h-0.5 bg-gradient-to-r from-pink-500 to-cyan-400"></div>
        <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="w-8 h-0.5 bg-cyan-400"></div>
      </div>
    </div>
  );
};
export default NotesNotFound;