import prisma from "../lib/prisma.js";

export const chat = async (req, res) => {
  const { postId } = req.body;
  const tokenUserId = req.userId;

  if (!postId) {
    return res.status(400).json({ success: false, message: "Post ID is required." });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found." });
    }

    const receiverId = post.userId;

    if (receiverId === tokenUserId) {
      return res.status(400).json({ success: false, message: "Cannot chat with yourself." });
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        userIDs: { hasEvery: [tokenUserId, receiverId] },
      },
    });

    if (existingChat) {
      return res.status(200).json({ success: true, message: "Chat already exists.", chat: existingChat });
    }

    const newChat = await prisma.chat.create({
      data: { userIDs: [tokenUserId, receiverId] },
    });

    res.status(200).json({ success: true, message: "Chat initiated.", chat: newChat });
  } catch (error) {
    console.error("chat error:", error);
    res.status(500).json({ success: false, message: "Failed to initiate chat." });
  }
};

export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: { hasSome: [tokenUserId] },
      },
    });

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);
      if (!receiverId) continue;

      const receiver = await prisma.user.findUnique({
        where: { id: receiverId },
        select: { id: true, username: true, avatar: true },
      });
      chat.receiver = receiver || undefined;
    }

    res.status(200).json({ success: true, chats });
  } catch (err) {
    console.error("getChats error:", err);
    res.status(500).json({ success: false, message: "Failed to get chats." });
  }
};

export const getChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
        userIDs: { hasSome: [tokenUserId] },
      },
      include: {
        messages: { orderBy: { createdAt: "asc" } },
      },
    });

    if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });

    await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: { hasSome: [tokenUserId] },
      },
      data: {
        seenBy: { push: [tokenUserId] },
      },
    });
    res.status(200).json({ success: true, chat });
  } catch (err) {
    console.error("getChat error:", err);
    res.status(500).json({ success: false, message: "Failed to get chat." });
  }
};

export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const { receiverId } = req.body;

  if (!receiverId) {
    return res.status(400).json({ success: false, message: "Receiver ID is required." });
  }

  if (receiverId === tokenUserId) {
    return res.status(400).json({ success: false, message: "Cannot chat with yourself." });
  }

  try {
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
    if (!receiver) {
      return res.status(404).json({ success: false, message: "Receiver not found." });
    }

    const newChat = await prisma.chat.create({
      data: { userIDs: [tokenUserId, receiverId] },
    });
    res.status(200).json({ success: true, chat: newChat });
  } catch (err) {
    console.error("addChat error:", err);
    res.status(500).json({ success: false, message: "Failed to add chat." });
  }
};

export const readChat = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
        userIDs: { hasSome: [tokenUserId] },
      },
      data: {
        seenBy: { set: [tokenUserId] },
      },
    });
    res.status(200).json({ success: true, chat });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Chat not found." });
    }
    console.error("readChat error:", err);
    res.status(500).json({ success: false, message: "Failed to read chat." });
  }
};