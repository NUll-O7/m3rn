import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface CreateChannelModalProps {
  serverId: Id<"servers">;
  onClose: () => void;
}

export function CreateChannelModal({ serverId, onClose }: CreateChannelModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"text" | "voice">("text");
  const [isLoading, setIsLoading] = useState(false);

  const createChannel = useMutation(api.channels.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    try {
      await createChannel({
        name: name.trim().toLowerCase().replace(/\s+/g, "-"),
        serverId,
        type,
        description: description.trim() || undefined,
      });
      onClose();
    } catch (error) {
      console.error("Failed to create channel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-semibold text-white mb-4">Create Channel</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Channel Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="text"
                  checked={type === "text"}
                  onChange={(e) => setType(e.target.value as "text")}
                  className="mr-2"
                />
                <span className="text-gray-300"># Text</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="voice"
                  checked={type === "voice"}
                  onChange={(e) => setType(e.target.value as "voice")}
                  className="mr-2"
                />
                <span className="text-gray-300">🔊 Voice</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Channel Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none"
              placeholder="Enter channel name"
              maxLength={50}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Channel names are lowercase and use dashes instead of spaces
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-indigo-500 outline-none resize-none"
              placeholder="What's this channel about?"
              rows={3}
              maxLength={200}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-2 rounded font-semibold transition-colors"
            >
              {isLoading ? "Creating..." : "Create Channel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
