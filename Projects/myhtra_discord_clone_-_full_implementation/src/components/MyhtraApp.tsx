import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Sidebar } from "./Sidebar";
import { ChatArea } from "./ChatArea";
import { MemberList } from "./MemberList";
import { DirectMessages } from "./DirectMessages";
import { Id } from "../../convex/_generated/dataModel";

export function MyhtraApp() {
  const [selectedServerId, setSelectedServerId] = useState<Id<"servers"> | null>(null);
  const [selectedChannelId, setSelectedChannelId] = useState<Id<"channels"> | null>(null);
  const [selectedDMUserId, setSelectedDMUserId] = useState<Id<"users"> | null>(null);
  const [showDMs, setShowDMs] = useState(false);

  const servers = useQuery(api.servers.list) || [];
  const channels = useQuery(
    api.channels.list,
    selectedServerId ? { serverId: selectedServerId } : "skip"
  ) || [];

  // Auto-select first server and channel
  if (servers.length > 0 && !selectedServerId && !showDMs) {
    setSelectedServerId(servers[0]._id);
  }

  if (channels.length > 0 && !selectedChannelId && selectedServerId && !showDMs) {
    setSelectedChannelId(channels[0]._id);
  }

  const handleServerSelect = (serverId: Id<"servers">) => {
    setSelectedServerId(serverId);
    setSelectedChannelId(null);
    setShowDMs(false);
    setSelectedDMUserId(null);
  };

  const handleChannelSelect = (channelId: Id<"channels">) => {
    setSelectedChannelId(channelId);
    setShowDMs(false);
    setSelectedDMUserId(null);
  };

  const handleDMSelect = (userId: Id<"users">) => {
    setSelectedDMUserId(userId);
    setShowDMs(true);
    setSelectedChannelId(null);
  };

  const handleShowDMs = () => {
    setShowDMs(true);
    setSelectedChannelId(null);
    setSelectedDMUserId(null);
  };

  return (
    <div className="flex h-screen bg-gray-800">
      <Sidebar
        servers={servers}
        selectedServerId={selectedServerId}
        onServerSelect={handleServerSelect}
        onShowDMs={handleShowDMs}
        showDMs={showDMs}
      />
      
      {showDMs ? (
        <DirectMessages
          selectedUserId={selectedDMUserId}
          onUserSelect={handleDMSelect}
        />
      ) : (
        <>
          <div className="flex-1 flex">
            <ChatArea
              serverId={selectedServerId}
              channelId={selectedChannelId}
              channels={channels}
              onChannelSelect={handleChannelSelect}
            />
            {selectedServerId && (
              <MemberList serverId={selectedServerId} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
