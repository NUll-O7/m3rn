import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const list = query({
  args: {
    otherUserId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: null };

    const messages = await ctx.db
      .query("directMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", userId).eq("receiverId", args.otherUserId)
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const reverseMessages = await ctx.db
      .query("directMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.otherUserId).eq("receiverId", userId)
      )
      .order("desc")
      .collect();

    // Combine and sort all messages
    const allMessages = [...messages.page, ...reverseMessages]
      .sort((a, b) => b._creationTime - a._creationTime)
      .slice(0, messages.page.length);

    // Get sender info for each message
    const messagesWithSenders = await Promise.all(
      allMessages.map(async (message) => {
        const sender = await ctx.db.get(message.senderId);
        return {
          ...message,
          sender: sender ? { name: sender.name, email: sender.email } : null,
        };
      })
    );

    return {
      ...messages,
      page: messagesWithSenders,
    };
  },
});

export const send = mutation({
  args: {
    content: v.string(),
    receiverId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const receiver = await ctx.db.get(args.receiverId);
    if (!receiver) throw new Error("User not found");

    const messageId = await ctx.db.insert("directMessages", {
      content: args.content,
      senderId: userId,
      receiverId: args.receiverId,
      read: false,
    });

    return messageId;
  },
});

export const markAsRead = mutation({
  args: { otherUserId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const unreadMessages = await ctx.db
      .query("directMessages")
      .withIndex("by_conversation", (q) =>
        q.eq("senderId", args.otherUserId).eq("receiverId", userId)
      )
      .filter((q) => q.eq(q.field("read"), false))
      .collect();

    await Promise.all(
      unreadMessages.map((message) =>
        ctx.db.patch(message._id, { read: true })
      )
    );

    return true;
  },
});

export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];

    const sentMessages = await ctx.db
      .query("directMessages")
      .withIndex("by_conversation", (q) => q.eq("senderId", userId))
      .collect();

    const receivedMessages = await ctx.db
      .query("directMessages")
      .withIndex("by_receiver", (q) => q.eq("receiverId", userId))
      .collect();

    // Get unique conversation partners
    const partners = new Set<string>();
    sentMessages.forEach((msg) => partners.add(msg.receiverId));
    receivedMessages.forEach((msg) => partners.add(msg.senderId));

    const conversations = await Promise.all(
      Array.from(partners).map(async (partnerId) => {
        const partner = await ctx.db.get(partnerId as any);
        const unreadCount = receivedMessages.filter(
          (msg) => msg.senderId === partnerId && !msg.read
        ).length;

        // Get last message
        const allMessages = [...sentMessages, ...receivedMessages]
          .filter(
            (msg) =>
              (msg.senderId === partnerId && msg.receiverId === userId) ||
              (msg.senderId === userId && msg.receiverId === partnerId)
          )
          .sort((a, b) => b._creationTime - a._creationTime);

        return {
          partner,
          unreadCount,
          lastMessage: allMessages[0] || null,
        };
      })
    );

    return conversations.filter((conv) => conv.partner);
  },
});
