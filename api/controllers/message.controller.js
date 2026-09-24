import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text?.trim();

  if (!text) {
    return res.status(400).json({ success: false, message: "Message text is required." });
  }

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userIDs: { hasSome: [tokenUserId] },
      },
    });

    if (!chat) return res.status(404).json({ success: false, message: "Chat not found." });

    const message = await prisma.message.create({
      data: { text, chatId, userId: tokenUserId },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        seenBy: { push: [tokenUserId] },
        lastMessage: text,
      },
    });

    res.status(200).json({ success: true, message });
  } catch (err) {
    console.error("addMessage error:", err);
    res.status(500).json({ success: false, message: "Failed to add message." });
  }
};
