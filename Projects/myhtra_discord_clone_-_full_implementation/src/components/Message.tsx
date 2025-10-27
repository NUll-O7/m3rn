import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

interface MessageProps {
  message: {
    _id: Id<"messages">;
    content: string;
    authorId: Id<"users">;
    _creationTime: number;
    edited?: boolean;
    editedAt?: number;
    author: { name?: string; email?: string } | null;
  };
}

export function Message({ message }: MessageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  
  const editMessage = useMutation(api.messages.edit);
  const deleteMessage = useMutation(api.messages.remove);

  const handleEdit = async () => {
    if (editContent.trim() === message.content) {
      setIsEditing(false);
      return;
    }

    try {
      await editMessage({
        messageId: message._id,
        content: editContent.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to edit message:", error);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage({ messageId: message._id });
      } catch (error) {
        console.error("Failed to delete message:", error);
      }
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="group hover:bg-gray-600/20 p-2 rounded transition-colors">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
          {message.author?.name?.charAt(0).toUpperCase() || 
           message.author?.email?.charAt(0).toUpperCase() || "?"}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline space-x-2">
            <span className="font-semibold text-white">
              {message.author?.name || message.author?.email || "Unknown User"}
            </span>
            <span className="text-xs text-gray-400">
              {formatTime(message._creationTime)}
              {message.edited && (
                <span className="ml-1 text-xs text-gray-500">(edited)</span>
              )}
            </span>
          </div>
          
          {isEditing ? (
            <div className="mt-1">
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEdit();
                  if (e.key === "Escape") setIsEditing(false);
                }}
                className="w-full bg-gray-600 text-white px-2 py-1 rounded border border-gray-500 focus:border-indigo-500 outline-none"
                autoFocus
              />
              <div className="text-xs text-gray-400 mt-1">
                Press Enter to save • Escape to cancel
              </div>
            </div>
          ) : (
            <div className="mt-1 text-gray-100 break-words">
              {message.content}
            </div>
          )}
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-600"
            title="Edit message"
          >
            ✏️
          </button>
          <button
            onClick={handleDelete}
            className="text-gray-400 hover:text-red-400 p-1 rounded hover:bg-gray-600"
            title="Delete message"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
