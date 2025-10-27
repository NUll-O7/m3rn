import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { CreateChannelModal } from "./CreateChannelModal";

interface ChannelListProps {
  channels: Array<{
    _id: Id<"channels">;
    name: string;
    type: "text" | "voice";
    serverId: Id<"servers">;
    position: number;
  }>;
  selectedChannelId: Id<"channels"> | null;
  onChannelSelect: (channelId: Id<"channels">) => void;
  serverId: Id<"servers">;
}

export function ChannelList({ channels, selectedChannelId, onChannelSelect, serverId }: ChannelListProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const textChannels = channels.filter(c => c.type === "text").sort((a, b) => a.position - b.position);
  const voiceChannels = channels.filter(c => c.type === "voice").sort((a, b) => a.position - b.position);

  return (
    <div className="w-60 bg-gray-800 flex flex-col">
      <div className="h-12 bg-gray-900 border-b border-gray-700 flex items-center px-4">
        <span className="text-white font-semibold">Server Name</span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {/* Text Channels */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
              Text Channels
            </span>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-gray-400 hover:text-white text-lg"
              title="Create Channel"
            >
              +
            </button>
          </div>
          {textChannels.map((channel) => (
            <button
              key={channel._id}
              onClick={() => onChannelSelect(channel._id)}
              className={`w-full text-left px-2 py-1 rounded flex items-center hover:bg-gray-700 transition-colors ${
                selectedChannelId === channel._id ? "bg-gray-600 text-white" : "text-gray-300"
              }`}
            >
              <span className="mr-2 text-gray-400">#</span>
              {channel.name}
            </button>
          ))}
        </div>

        {/* Voice Channels */}
        {voiceChannels.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-xs font-semibold uppercase tracking-wide">
                Voice Channels
              </span>
            </div>
            {voiceChannels.map((channel) => (
              <button
                key={channel._id}
                className="w-full text-left px-2 py-1 rounded flex items-center hover:bg-gray-700 transition-colors text-gray-300"
              >
                <span className="mr-2 text-gray-400">🔊</span>
                {channel.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateChannelModal
          serverId={serverId}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
}
