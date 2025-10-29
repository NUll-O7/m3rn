import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../lib/axios.js";

const CreatePage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      await api.post("/notes", {
        title,
        content,
      });

      toast.success("Note created successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error creating note", error);
      if (error.response && error.response.status === 429) {
        toast.error("Slow down! You're creating notes too fast", {
          duration: 4000,
          icon: "💀",
        });
      } else {
        toast.error("Failed to create note");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-b from-purple-900 via-pink-900 to-orange-900">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(236, 72, 153, 0.3) 2px, transparent 2px),
                           linear-gradient(90deg, rgba(236, 72, 153, 0.3) 2px, transparent 2px)`,
            backgroundSize: "50px 50px",
            transform: "perspective(500px) rotateX(60deg)",
            transformOrigin: "center top",
          }}
        ></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-pink-500 rounded-full blur-[128px] opacity-30 animate-pulse"></div>
      <div
        className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500 rounded-full blur-[128px] opacity-30 animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 px-4 py-2 mb-6 text-cyan-400 hover:text-pink-400 transition-colors duration-300 font-bold tracking-wider"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="relative">
              BACK TO NOTES
              <span className="absolute inset-0 blur-md bg-cyan-400 opacity-50 group-hover:bg-pink-400"></span>
            </span>
          </button>

          <div className="relative">
            {/* Neon glow effect */}
            <div className="absolute inset-0 bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 rounded-2xl blur-xl opacity-50"></div>

            {/* Card */}
            <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-2xl border-2 border-pink-500 shadow-[0_0_30px_rgba(236,72,153,0.5)]">
              <div className="p-8">
                <h2 className="text-4xl font-bold mb-8 bg-linear-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-wider">
                  CREATE NEW NOTE
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-cyan-400 font-bold tracking-wider mb-2 text-sm uppercase">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="Enter note title..."
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-purple-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-300"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-400 font-bold tracking-wider mb-2 text-sm uppercase">
                      Content
                    </label>
                    <textarea
                      placeholder="Write your thoughts..."
                      className="w-full px-4 py-3 bg-gray-800/50 border-2 border-purple-500 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-pink-500 focus:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all duration-300 h-40 resize-none"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="relative group px-8 py-3 font-bold tracking-widest text-white uppercase overflow-hidden rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {/* Button gradient background */}
                      <div className="absolute inset-0 bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 group-hover:scale-110 transition-transform duration-300"></div>

                      {/* Button glow */}
                      <div className="absolute inset-0 bg-linear-to-r from-pink-500 via-purple-500 to-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>

                      {/* Button text */}
                      <span className="relative z-10">
                        {loading ? "CREATING..." : "CREATE NOTE"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scanline effect */}
      <div
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-transparent via-pink-500/5 to-transparent animate-[scan_8s_linear_infinite]"
        style={{
          backgroundSize: "100% 200%",
          animation: "scan 8s linear infinite",
        }}
      ></div>

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

export default CreatePage;
