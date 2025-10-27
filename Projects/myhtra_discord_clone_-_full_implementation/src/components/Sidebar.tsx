import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { CreateServerModal } from "./CreateServerModal";
import { SignOutButton } from "../SignOutButton";

interface SidebarProps {
  servers: Array<{
    _id: Id<"servers">;
    name: string;
    description?: string;
    ownerId: Id<"users">;
    memberIds: Id<"users">[];
  }>;
  selectedServerId: Id<"servers"> | null;
  onServerSelect: (serverId: Id<"servers">) => void;
  onShowDMs: () => void;
  showDMs: boolean;
}

export function Sidebar({ servers, selectedServerId, onServerSelect, onShowDMs, showDMs }: SidebarProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="w-16 bg-gray-900 flex flex-col items-center py-3 space-y-2">
      {/* Direct Messages Button */}
      <button
        onClick={onShowDMs}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-200 ${
          showDMs
            ? "bg-indigo-600 text-white"
            : "bg-gray-700 hover:bg-indigo-500 hover:rounded-2xl"
        }`}
        title="Direct Messages"
      >
        DM
      </button>

      <div className="w-8 h-0.5 bg-gray-700 rounded"></div>

      {/* Server List */}
      {servers.map((server) => (
        <button
          key={server._id}
          onClick={() => onServerSelect(server._id)}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold transition-all duration-200 ${
            selectedServerId === server._id
              ? "bg-indigo-600 text-white"
              : "bg-gray-700 hover:bg-indigo-500 hover:rounded-2xl"
          }`}
          title={server.name}
        >
          {server.name.charAt(0).toUpperCase()}
        </button>
      ))}

      {/* Add Server Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-12 h-12 rounded-full bg-gray-700 hover:bg-green-500 hover:rounded-2xl flex items-center justify-center text-green-400 hover:text-white transition-all duration-200 text-2xl"
        title="Add Server"
      >
        +
      </button>

      {/* Spacer */}
      <div className="flex-1"></div>

      {/* Settings/Profile */}
      <div className="w-12 h-12 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center">
        <SignOutButton />
      </div>

      {showCreateModal && (
        <CreateServerModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
