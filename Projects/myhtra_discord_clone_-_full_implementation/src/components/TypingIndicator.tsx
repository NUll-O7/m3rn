import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface TypingIndicatorProps {
  channelId: Id<"channels">;
}

export function TypingIndicator({ channelId }: TypingIndicatorProps) {
  const typingUsers = useQuery(api.presence.getTypingUsers, { channelId }) || [];

  if (typingUsers.length === 0) return null;

  const getTypingText = () => {
    if (typingUsers.length === 1) {
      const user = typingUsers[0];
      const name = user?.name || user?.email || "Someone";
      return `${name} is typing...`;
    } else if (typingUsers.length === 2) {
      const names = typingUsers.map(u => u?.name || u?.email || "Someone");
      return `${names[0]} and ${names[1]} are typing...`;
    } else {
      return "Several people are typing...";
    }
  };

  return (
    <div className="px-4 py-2 text-sm text-gray-400 italic">
      <div className="flex items-center space-x-1">
        <div className="flex space-x-1">
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
          <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
        </div>
        <span className="ml-2">{getTypingText()}</span>
      </div>
    </div>
  );
}
