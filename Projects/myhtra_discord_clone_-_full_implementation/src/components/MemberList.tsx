import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface MemberListProps {
  serverId: Id<"servers">;
}

export function MemberList({ serverId }: MemberListProps) {
  const members = useQuery(api.presence.getServerMembers, { serverId }) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "busy": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online": return "Online";
      case "away": return "Away";
      case "busy": return "Do Not Disturb";
      default: return "Offline";
    }
  };

  const onlineMembers = members.filter(m => m.presence.status === "online");
  const offlineMembers = members.filter(m => m.presence.status !== "online");

  return (
    <div className="w-60 bg-gray-800 border-l border-gray-700">
      <div className="p-4">
        <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-4">
          Members — {members.length}
        </h3>

        {/* Online Members */}
        {onlineMembers.length > 0 && (
          <div className="mb-6">
            <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">
              Online — {onlineMembers.length}
            </h4>
            <div className="space-y-2">
              {onlineMembers.map((member) => (
                <div key={member.user?._id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition-colors">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                      {member.user?.name?.charAt(0).toUpperCase() || 
                       member.user?.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(member.presence.status)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">
                      {member.user?.name || member.user?.email || "Unknown User"}
                    </div>
                    {member.presence.currentActivity && (
                      <div className="text-gray-400 text-xs truncate">
                        {member.presence.currentActivity}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offline Members */}
        {offlineMembers.length > 0 && (
          <div>
            <h4 className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-2">
              Offline — {offlineMembers.length}
            </h4>
            <div className="space-y-2">
              {offlineMembers.map((member) => (
                <div key={member.user?._id} className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition-colors opacity-60">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-gray-300 text-sm font-semibold">
                      {member.user?.name?.charAt(0).toUpperCase() || 
                       member.user?.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${getStatusColor(member.presence.status)}`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-300 text-sm font-medium truncate">
                      {member.user?.name || member.user?.email || "Unknown User"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
