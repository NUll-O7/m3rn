import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { DirectMessageChat } from "./DirectMessageChat";

interface DirectMessagesProps {
  selectedUserId: Id<"users"> | null;
  onUserSelect: (userId: Id<"users">) => void;
}

export function DirectMessages({ selectedUserId, onUserSelect }: DirectMessagesProps) {
  const conversations = useQuery(api.directMessages.getConversations) || [];

  return (
    <div className="flex-1 flex">
      {/* Conversations List */}
      <div className="w-60 bg-gray-800 flex flex-col">
        <div className="h-12 bg-gray-900 border-b border-gray-700 flex items-center px-4">
          <span className="text-white font-semibold">Direct Messages</span>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <p className="text-sm">No conversations yet</p>
              <p className="text-xs mt-1">Start chatting with someone!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <button
                  key={conversation.partner?._id}
                  onClick={() => conversation.partner && onUserSelect(conversation.partner._id as any)}
                  className={`w-full text-left p-2 rounded hover:bg-gray-700 transition-colors ${
                    selectedUserId === conversation.partner?._id ? "bg-gray-600" : ""
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold">
                      {(conversation.partner as any)?.name?.charAt(0).toUpperCase() || 
                       (conversation.partner as any)?.email?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium truncate">
                          {(conversation.partner as any)?.name || (conversation.partner as any)?.email || "Unknown User"}
                        </span>
                        {conversation.unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      {conversation.lastMessage && (
                        <div className="text-gray-400 text-xs truncate mt-1">
                          {conversation.lastMessage.content}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-gray-700">
        {selectedUserId ? (
          <DirectMessageChat userId={selectedUserId} />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <h2 className="text-xl font-semibold mb-2">Select a conversation</h2>
              <p>Choose a conversation from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
