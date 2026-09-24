import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

const SAFE_USER_SELECT = {
  id: true,
  username: true,
  email: true,
  avatar: true,
  isAdmin: true,
  createdAt: true,
};

export const getUsers = async (_req, res) => {
  try {
    const users = await prisma.user.findMany({ select: SAFE_USER_SELECT });
    res.status(200).json({ success: true, users });
  } catch (err) {
    console.error("getUsers error:", err);
    res.status(500).json({ success: false, message: "Failed to get users." });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: SAFE_USER_SELECT,
    });
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    res.status(200).json({ success: true, ...user });
  } catch (err) {
    console.error("getUser error:", err);
    res.status(500).json({ success: false, message: "Failed to get user." });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ success: false, message: "Not authorized." });
  }

  // Validate email if provided
  if (inputs.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inputs.email)) {
      return res.status(400).json({ success: false, message: "Invalid email format." });
    }
  }

  // Validate password if provided
  if (password && password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
  }

  try {
    const data = { ...inputs };
    if (password) data.password = await bcrypt.hash(password, 10);
    if (avatar) data.avatar = avatar;

    const updatedUser = await prisma.user.update({
      where: { id },
      data,
      select: SAFE_USER_SELECT,
    });

    res.status(200).json({ success: true, ...updatedUser });
  } catch (err) {
    if (err.code === "P2002") {
      return res.status(409).json({ success: false, message: "Username or email already taken." });
    }
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    console.error("updateUser error:", err);
    res.status(500).json({ success: false, message: "Failed to update user." });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ success: false, message: "Not authorized." });
  }

  try {
    await prisma.user.delete({ where: { id } });
    res.clearCookie("token").status(200).json({ success: true, message: "User deleted." });
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "User not found." });
    }
    console.error("deleteUser error:", err);
    res.status(500).json({ success: false, message: "Failed to delete user." });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  if (!postId) {
    return res.status(400).json({ success: false, message: "Post ID is required." });
  }

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: { userId: tokenUserId, postId },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({ where: { id: savedPost.id } });
      res.status(200).json({ success: true, message: "Post removed from saved list." });
    } else {
      await prisma.savedPost.create({
        data: { userId: tokenUserId, postId },
      });
      res.status(200).json({ success: true, message: "Post saved." });
    }
  } catch (err) {
    if (err.code === "P2025") {
      return res.status(404).json({ success: false, message: "Post not found." });
    }
    console.error("savePost error:", err);
    res.status(500).json({ success: false, message: "Failed to save post." });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const [userPosts, saved] = await Promise.all([
      prisma.post.findMany({ where: { userId: tokenUserId } }),
      prisma.savedPost.findMany({
        where: { userId: tokenUserId },
        include: { post: true },
      }),
    ]);

    const savedPosts = saved.map((item) => item.post);
    res.status(200).json({ success: true, userPosts, savedPosts });
  } catch (err) {
    console.error("profilePosts error:", err);
    res.status(500).json({ success: false, message: "Failed to get profile posts." });
  }
};

export const getNotificationNumber = async (req, res) => {
  const tokenUserId = req.userId;
  try {
    const number = await prisma.chat.count({
      where: {
        userIDs: { hasSome: [tokenUserId] },
        NOT: { seenBy: { hasSome: [tokenUserId] } },
      },
    });
    res.status(200).json(number);
  } catch (err) {
    console.error("getNotificationNumber error:", err);
    res.status(500).json({ success: false, message: "Failed to get notifications." });
  }
};
