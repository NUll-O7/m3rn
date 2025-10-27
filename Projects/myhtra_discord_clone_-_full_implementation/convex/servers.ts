import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const servers = await ctx.db
      .query("servers")
      .collect();

    // Filter servers where user is a member
    return servers.filter(server => server.memberIds.includes(userId));
  },
});

export const get = query({
  args: { serverId: v.id("servers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const server = await ctx.db.get(args.serverId);
    if (!server || !server.memberIds.includes(userId)) {
      return null;
    }

    return server;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const serverId = await ctx.db.insert("servers", {
      name: args.name,
      description: args.description,
      ownerId: userId,
      memberIds: [userId],
    });

    // Create a default general channel
    await ctx.db.insert("channels", {
      name: "general",
      serverId,
      type: "text",
      position: 0,
    });

    return serverId;
  },
});

export const join = mutation({
  args: { serverId: v.id("servers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const server = await ctx.db.get(args.serverId);
    if (!server) throw new Error("Server not found");

    if (!server.memberIds.includes(userId)) {
      await ctx.db.patch(args.serverId, {
        memberIds: [...server.memberIds, userId],
      });
    }

    return server;
  },
});

export const leave = mutation({
  args: { serverId: v.id("servers") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const server = await ctx.db.get(args.serverId);
    if (!server) throw new Error("Server not found");

    if (server.ownerId === userId) {
      throw new Error("Owner cannot leave server");
    }

    await ctx.db.patch(args.serverId, {
      memberIds: server.memberIds.filter((id) => id !== userId),
    });

    return true;
  },
});
