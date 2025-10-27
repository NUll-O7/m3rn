import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {
    channelId: v.id("channels"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: null };

    // Check if user has access to channel
    const channel = await ctx.db.get(args.channelId);
    if (!channel) return { page: [], isDone: true, continueCursor: null };

    const server = await ctx.db.get(channel.serverId);
    if (!server || !server.memberIds.includes(userId)) {
      return { page: [], isDone: true, continueCursor: null };
    }

    const messages = await ctx.db
      .query("messages")
      .withIndex("by_channel", (q) => q.eq("channelId", args.channelId))
      .order("desc")
      .paginate(args.paginationOpts);

    // Get author info for each message
    const messagesWithAuthors = await Promise.all(
      messages.page.map(async (message) => {
        const author = await ctx.db.get(message.authorId);
        return {
          ...message,
          author: author ? { name: author.name, email: author.email } : null,
        };
      })
    );

    return {
      ...messages,
      page: messagesWithAuthors,
    };
  },
});

export const send = mutation({
  args: {
    content: v.string(),
    channelId: v.id("channels"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Check if user has access to channel
    const channel = await ctx.db.get(args.channelId);
    if (!channel) throw new Error("Channel not found");

    const server = await ctx.db.get(channel.serverId);
    if (!server || !server.memberIds.includes(userId)) {
      throw new Error("Access denied");
    }

    const messageId = await ctx.db.insert("messages", {
      content: args.content,
      authorId: userId,
      channelId: args.channelId,
      serverId: channel.serverId,
    });

    return messageId;
  },
});

export const edit = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    if (message.authorId !== userId) {
      throw new Error("Can only edit your own messages");
    }

    await ctx.db.patch(args.messageId, {
      content: args.content,
      edited: true,
      editedAt: Date.now(),
    });

    return true;
  },
});

export const remove = mutation({
  args: { messageId: v.id("messages") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const message = await ctx.db.get(args.messageId);
    if (!message) throw new Error("Message not found");

    if (message.authorId !== userId) {
      throw new Error("Can only delete your own messages");
    }

    await ctx.db.delete(args.messageId);
    return true;
  },
});
