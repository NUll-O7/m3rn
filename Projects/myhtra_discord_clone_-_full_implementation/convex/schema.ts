import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  servers: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    icon: v.optional(v.id("_storage")),
    ownerId: v.id("users"),
    memberIds: v.array(v.id("users")),
  })
    .index("by_owner", ["ownerId"]),

  channels: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    serverId: v.id("servers"),
    type: v.union(v.literal("text"), v.literal("voice")),
    position: v.number(),
  })
    .index("by_server", ["serverId"])
    .index("by_server_position", ["serverId", "position"]),

  messages: defineTable({
    content: v.string(),
    authorId: v.id("users"),
    channelId: v.id("channels"),
    serverId: v.id("servers"),
    edited: v.optional(v.boolean()),
    editedAt: v.optional(v.number()),
    attachments: v.optional(v.array(v.id("_storage"))),
  })
    .index("by_channel", ["channelId"])
    .index("by_server", ["serverId"])
    .index("by_author", ["authorId"]),

  directMessages: defineTable({
    content: v.string(),
    senderId: v.id("users"),
    receiverId: v.id("users"),
    read: v.boolean(),
  })
    .index("by_conversation", ["senderId", "receiverId"])
    .index("by_receiver", ["receiverId"]),

  userPresence: defineTable({
    userId: v.id("users"),
    status: v.union(
      v.literal("online"),
      v.literal("away"),
      v.literal("busy"),
      v.literal("offline")
    ),
    lastSeen: v.number(),
    currentActivity: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"]),

  typingIndicators: defineTable({
    userId: v.id("users"),
    channelId: v.id("channels"),
    isTyping: v.boolean(),
    lastTyping: v.number(),
  })
    .index("by_channel", ["channelId"])
    .index("by_user_channel", ["userId", "channelId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
