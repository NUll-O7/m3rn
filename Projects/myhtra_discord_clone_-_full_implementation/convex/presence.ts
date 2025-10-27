import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const updateStatus = mutation({
  args: {
    status: v.union(
      v.literal("online"),
      v.literal("away"),
      v.literal("busy"),
      v.literal("offline")
    ),
    activity: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("userPresence")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        lastSeen: Date.now(),
        currentActivity: args.activity,
      });
    } else {
      await ctx.db.insert("userPresence", {
        userId,
        status: args.status,
        lastSeen: Date.now(),
        currentActivity: args.activity,
      });
    }

    return true;
  },
});

export const getServerMembers = query({
  args: { serverId: v.id("servers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const server = await ctx.db.get(args.serverId);
    if (!server || !server.memberIds.includes(userId)) {
      return [];
    }

    const members = await Promise.all(
      server.memberIds.map(async (memberId) => {
        const user = await ctx.db.get(memberId);
        const presence = await ctx.db
          .query("userPresence")
          .withIndex("by_user", (q) => q.eq("userId", memberId))
          .unique();

        return {
          user,
          presence: presence || {
            status: "offline" as const,
            lastSeen: 0,
            currentActivity: undefined,
          },
        };
      })
    );

    return members.filter((member) => member.user);
  },
});

export const setTyping = mutation({
  args: {
    channelId: v.id("channels"),
    isTyping: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("typingIndicators")
      .withIndex("by_user_channel", (q) =>
        q.eq("userId", userId).eq("channelId", args.channelId)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isTyping: args.isTyping,
        lastTyping: Date.now(),
      });
    } else {
      await ctx.db.insert("typingIndicators", {
        userId,
        channelId: args.channelId,
        isTyping: args.isTyping,
        lastTyping: Date.now(),
      });
    }

    return true;
  },
});

export const getTypingUsers = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const typingIndicators = await ctx.db
      .query("typingIndicators")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .filter((q) => q.eq(q.field("isTyping"), true))
      .filter((q) => q.neq(q.field("userId"), userId))
      .collect();

    // Filter out old typing indicators (older than 5 seconds)
    const recentTyping = typingIndicators.filter(
      (indicator) => Date.now() - indicator.lastTyping < 5000
    );

    const typingUsers = await Promise.all(
      recentTyping.map(async (indicator) => {
        const user = await ctx.db.get(indicator.userId);
        return user;
      })
    );

    return typingUsers.filter(Boolean);
  },
});
