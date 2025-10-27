import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChannelList } from "./ChannelList";
import { TypingIndicator } from "./TypingIndicator";

interface ChatAreaProps {
  serverId: Id<"servers"> | null;
  channelId: Id<"channels"> | null;
  channels: Array<{
    _id: Id<"channels">;
    name: string;
    type: "text" | "voice";
    serverId: Id<"servers">;
    position: number;
  }>;
  onChannelSelect: (channelId: Id<"channels">) => void;
}

export function ChatArea({ serverId, channelId, channels, onChannelSelect }: ChatAreaProps) {
  const [messageContent, setMessageContent] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = useMutation(api.messages.send);
  const setTypingMutation = useMutation(api.presence.setTyping);

  const currentChannel = useQuery(
    api.channels.get,
    channelId ? { channelId } : "skip"
  );

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !channelId) return;

    try {
      await sendMessage({
        content: messageContent.trim(),
        channelId,
      });
      setMessageContent("");
      
      // Stop typing indicator
      if (isTyping) {
        await setTypingMutation({ channelId, isTyping: false });
        setIsTyping(false);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleTyping = async (content: string) => {
    setMessageContent(content);

    if (!channelId) return;

    // Start typing indicator if not already typing
    if (!isTyping && content.trim()) {
      setIsTyping(true);
      await setTypingMutation({ channelId, isTyping: true });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(async () => {
      if (isTyping) {
        setIsTyping(false);
        await setTypingMutation({ channelId, isTyping: false });
      }
    }, 3000);

    // Stop typing immediately if content is empty
    if (!content.trim() && isTyping) {
      setIsTyping(false);
      await setTypingMutation({ channelId, isTyping: false });
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (!serverId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-700">
        <div className="text-center text-gray-400">
          <h2 className="text-2xl font-semibold mb-2">Welcome to Myhtra!</h2>
          <p>Select a server to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex">
      <ChannelList
        channels={channels}
        selectedChannelId={channelId}
        onChannelSelect={onChannelSelect}
        serverId={serverId}
      />
      
      <div className="flex-1 flex flex-col bg-gray-700">
        {currentChannel ? (
          <>
            {/* Channel Header */}
            <div className="h-12 bg-gray-800 border-b border-gray-600 flex items-center px-4">
              <span className="text-gray-300 mr-2">#</span>
              <span className="text-white font-semibold">{currentChannel.name}</span>
              {currentChannel.description && (
                <span className="text-gray-400 ml-2 text-sm">
                  | {currentChannel.description}
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-hidden">
              <MessageList channelId={channelId!} />
            </div>

            {/* Typing Indicator */}
            <TypingIndicator channelId={channelId!} />

            {/* Message Input */}
            <MessageInput
              value={messageContent}
              onChange={handleTyping}
              onSend={handleSendMessage}
              placeholder={`Message #${currentChannel.name}`}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <h2 className="text-xl font-semibold mb-2">Select a channel</h2>
              <p>Choose a channel from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
