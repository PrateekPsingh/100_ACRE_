import prisma from "../lib/prisma.js";


export const initiatechat = async (req, res) => {
    const tokenUserId = req.userId;
    try {
      const newChat = await prisma.chat.create({
        data: {
          userIDs: [tokenUserId, req.body.receiverId],
        },
      });
      res.status(200).json(newChat);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Failed to add chat!" });
    }
  };