import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { MessageInput } from "./MessageInput";

interface DirectMessageChatProps {
  userId: Id<"users">;
}

export function DirectMessageChat({ userId }: DirectMessageChatProps) {
  const [messageContent, setMessageContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const user = useQuery(api.auth.loggedInUser);
  const otherUser = useQuery(
    api.auth.loggedInUser, // We'll need to create a getUserById query
    "skip" // For now, skip this
  );

  const messages = useQuery(api.directMessages.list, {
    otherUserId: userId,
    paginationOpts: { numItems: 50, cursor: null },
  });

  const sendMessage = useMutation(api.directMessages.send);
  const markAsRead = useMutation(api.directMessages.markAsRead);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages?.page]);

  useEffect(() => {
    // Mark messages as read when opening conversation
    markAsRead({ otherUserId: userId });
  }, [userId, markAsRead]);

  const handleSendMessage = async () => {
    if (!messageContent.trim()) return;

    try {
      await sendMessage({
        content: messageContent.trim(),
        receiverId: userId,
      });
      setMessageContent("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!messages) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="h-12 bg-gray-800 border-b border-gray-600 flex items-center px-4">
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold mr-3">
          ?
        </div>
        <span className="text-white font-semibold">Direct Message</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.page.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.page.reverse().map((message) => (
              <div key={message._id} className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                  {message.sender?.name?.charAt(0).toUpperCase() || 
                   message.sender?.email?.charAt(0).toUpperCase() || "?"}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-semibold text-white">
                      {message.sender?.name || message.sender?.email || "Unknown User"}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatTime(message._creationTime)}
                    </span>
                  </div>
                  
                  <div className="mt-1 text-gray-100 break-words">
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <MessageInput
        value={messageContent}
        onChange={setMessageContent}
        onSend={handleSendMessage}
        placeholder="Type a message..."
      />
    </div>
  );
}
