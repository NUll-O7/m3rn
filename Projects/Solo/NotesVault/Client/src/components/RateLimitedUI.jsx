import { Zap } from "lucide-react";

const RateLimitedUI = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <style>{`
        @keyframes electricPulse {
          0%, 100% { 
            filter: drop-shadow(0 0 10px #fbbf24) drop-shadow(0 0 20px #fbbf24);
            transform: scale(1);
          }
          50% { 
            filter: drop-shadow(0 0 20px #fbbf24) drop-shadow(0 0 40px #fbbf24);
            transform: scale(1.1);
          }
        }
        @keyframes glitchText {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-2px, 2px); }
          94% { transform: translate(2px, -2px); }
          96% { transform: translate(-2px, -2px); }
          98% { transform: translate(2px, 2px); }
        }
        @keyframes scanlineMove {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes borderGlow {
          0%, 100% { 
            box-shadow: 0 0 10px rgba(251, 191, 36, 0.5), 0 0 20px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(251, 191, 36, 0.1);
          }
          50% { 
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.8), 0 0 40px rgba(239, 68, 68, 0.5), inset 0 0 30px rgba(251, 191, 36, 0.2);
          }
        }
        .neon-border {
          animation: borderGlow 2s ease-in-out infinite;
        }
        .glitch-text {
          animation: glitchText 3s infinite;
        }
      `}</style>

      <div className="relative bg-black/70 backdrop-blur-md border-2 border-yellow-400 rounded-2xl shadow-lg overflow-hidden neon-border">
        {/* Scanline overlay */}
        <div className="absolute inset-0 overflow-hidden opacity-20 pointer-events-none">
          <div 
            className="absolute w-full h-2 bg-linear-to-r from-transparent via-yellow-400 to-transparent blur-sm"
            style={{ animation: 'scanlineMove 4s linear infinite' }}
          ></div>
        </div>

        {/* Warning stripes */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-linear-to-r from-yellow-400 via-red-500 to-yellow-400 opacity-70"></div>
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-linear-to-r from-yellow-400 via-red-500 to-yellow-400 opacity-70"></div>

        <div className="flex flex-col md:flex-row items-center p-8 relative z-10">
          {/* Icon container */}
          <div className="shrink-0 relative mb-6 md:mb-0 md:mr-8">
            <div className="bg-linear-to-br from-yellow-500/30 to-red-500/30 p-6 rounded-full border-2 border-yellow-400 backdrop-blur-sm relative">
              {/* Rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-red-500 border-dashed opacity-50" style={{ animation: 'spin 4s linear infinite' }}></div>
              
              <Zap 
                className="size-12 text-yellow-400 relative z-10" 
                style={{ animation: 'electricPulse 1s ease-in-out infinite' }}
              />

              {/* Corner brackets */}
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-red-500"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-red-500"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-red-500"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-red-500"></div>
            </div>

            {/* Pulsing dots */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
          </div>

          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
              <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-red-500 uppercase tracking-wider glitch-text"
                style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.8), 0 0 20px rgba(251, 191, 36, 0.6)' }}>
                Rate Limit Reached
              </h3>
            </div>

            <div className="space-y-2 font-mono">
              <p className="text-yellow-100 text-lg">
                <span className="text-red-500 font-bold">{'[ ! ]'}</span> You've made too many requests in a short period.{' '}
                <span className="text-yellow-400 font-bold">Please wait a moment.</span>
              </p>
              <p className="text-cyan-300/80 text-sm flex items-center justify-center md:justify-start gap-2">
                <span className="text-yellow-400">{'>'}</span>
                Try again in a few seconds for the best experience.
                <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1"></span>
              </p>
            </div>

            {/* Progress bar */}
            <div className="mt-4 h-2 bg-black/50 rounded-full overflow-hidden border border-yellow-400/30">
              <div 
                className="h-full bg-linear-to-r from-red-500 via-yellow-400 to-red-500 rounded-full"
                style={{ 
                  width: '100%',
                  animation: 'pulse 2s ease-in-out infinite'
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-4 right-4 flex gap-2 opacity-50">
          <div className="w-3 h-3 border-2 border-yellow-400 rotate-45"></div>
          <div className="w-3 h-3 border-2 border-red-500 rotate-45"></div>
          <div className="w-3 h-3 border-2 border-yellow-400 rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default RateLimitedUI;