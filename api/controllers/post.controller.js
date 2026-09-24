import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: query.bedroom ? parseInt(query.bedroom) : undefined,
        price: {
          gte: query.minPrice ? parseInt(query.minPrice) : undefined,
          lte: query.maxPrice ? parseInt(query.maxPrice) : undefined,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ success: true, posts });
  } catch (err) {
    console.error("getPosts error:", err);
    res.status(500).json({ success: false, message: "Failed to get posts." });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: { select: { username: true, avatar: true } },
      },
    });

    if (!post) return res.status(404).json({ success: false, message: "Post not found." });

    const token = req.cookies?.token;

    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(200).json({ ...post, isSaved: false });

        const saved = await prisma.savedPost.findUnique({
          where: { userId_postId: { postId: id, userId: payload.id } },
        });

        return res.status(200).json({ ...post, isSaved: !!saved });
      });
    }

    return res.status(200).json({ ...post, isSaved: false });
  } catch (err) {
    console.error("getPost error:", err);
    return res.status(500).json({ success: false, message: "Failed to get post." });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId;

  // Validation
  if (!body?.postData) return res.status(400).json({ success: false, message: "postData is required." });
  const d = body.postData;
  if (!d.title) return res.status(400).json({ success: false, message: "Title is required." });
  if (d.price === undefined || d.price === null || d.price <= 0) return res.status(400).json({ success: false, message: "Price must be positive." });
  if (!d.address) return res.status(400).json({ success: false, message: "Address is required." });
  if (!d.city) return res.status(400).json({ success: false, message: "City is required." });
  if (d.bedroom === undefined || d.bedroom < 0) return res.status(400).json({ success: false, message: "Bedroom must be >= 0." });
  if (d.bathroom === undefined || d.bathroom < 0) return res.status(400).json({ success: false, message: "Bathroom must be >= 0." });
  if (!d.type || (d.type !== "buy" && d.type !== "rent")) return res.status(400).json({ success: false, message: "Type must be buy or rent." });
  if (!d.property || !["apartment", "house", "condo", "land"].includes(d.property)) return res.status(400).json({ success: false, message: "Invalid property type." });
  if (!d.images || !d.images.length) return res.status(400).json({ success: false, message: "At least one image is required." });
  if (d.latitude === undefined || d.longitude === undefined) return res.status(400).json({ success: false, message: "Latitude and longitude are required." });

  try {
    const newPost = await prisma.post.create({
      data: {
        ...d,
        userId: tokenUserId,
        postDetail: { create: body.postDetail || {} },
      },
    });
    res.status(201).json({ success: true, post: newPost });
  } catch (err) {
    console.error("addPost error:", err);
    res.status(500).json({ success: false, message: "Failed to create post." });
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const body = req.body;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ success: false, message: "Post not found." });
    if (post.userId !== tokenUserId) return res.status(403).json({ success: false, message: "Not authorized." });

    const updatedPost = await prisma.post.update({ where: { id }, data: body });
    res.status(200).json({ success: true, post: updatedPost });
  } catch (err) {
    console.error("updatePost error:", err);
    res.status(500).json({ success: false, message: "Failed to update post." });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  try {
    const post = await prisma.post.findUnique({ where: { id } });
    if (!post) return res.status(404).json({ success: false, message: "Post not found." });
    if (post.userId !== tokenUserId) return res.status(403).json({ success: false, message: "Not authorized." });

    await prisma.post.delete({ where: { id } });
    res.status(200).json({ success: true, message: "Post deleted." });
  } catch (err) {
    console.error("deletePost error:", err);
    res.status(500).json({ success: false, message: "Failed to delete post." });
  }
};
