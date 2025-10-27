import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { serverId: v.id("servers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    // Check if user is member of server
    const server = await ctx.db.get(args.serverId);
    if (!server || !server.memberIds.includes(userId)) {
      return [];
    }

    const channels = await ctx.db
      .query("channels")
      .withIndex("by_server_position", (q) => q.eq("serverId", args.serverId))
      .collect();

    return channels;
  },
});

export const get = query({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const channel = await ctx.db.get(args.channelId);
    if (!channel) return null;

    // Check if user is member of server
    const server = await ctx.db.get(channel.serverId);
    if (!server || !server.memberIds.includes(userId)) {
      return null;
    }

    return channel;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    serverId: v.id("servers"),
    type: v.union(v.literal("text"), v.literal("voice")),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const server = await ctx.db.get(args.serverId);
    if (!server) throw new Error("Server not found");

    if (server.ownerId !== userId) {
      throw new Error("Only server owner can create channels");
    }

    // Get next position
    const channels = await ctx.db
      .query("channels")
      .withIndex("by_server", (q) => q.eq("serverId", args.serverId))
      .collect();

    const position = channels.length;

    const channelId = await ctx.db.insert("channels", {
      name: args.name,
      serverId: args.serverId,
      type: args.type,
      description: args.description,
      position,
    });

    return channelId;
  },
});

export const remove = mutation({
  args: { channelId: v.id("channels") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const channel = await ctx.db.get(args.channelId);
    if (!channel) throw new Error("Channel not found");

    const server = await ctx.db.get(channel.serverId);
    if (!server || server.ownerId !== userId) {
      throw new Error("Only server owner can delete channels");
    }

    await ctx.db.delete(args.channelId);
    return true;
  },
});
