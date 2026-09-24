import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const io = new Server({
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    methods: ["GET", "POST"],
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    try {
      if (!userId || typeof userId !== "string") return;
      addUser(userId, socket.id);
      console.log(`User ${userId} connected (socket: ${socket.id})`);
    } catch (err) {
      console.error("newUser error:", err);
    }
  });

  socket.on("sendMessage", ({ receiverId, data } = {}) => {
    try {
      if (!receiverId || !data) return;
      const receiver = getUser(receiverId);
      if (receiver?.socketId) {
        io.to(receiver.socketId).emit("getMessage", data);
      }
    } catch (err) {
      console.error("sendMessage error:", err);
    }
  });

  socket.on("disconnect", () => {
    try {
      removeUser(socket.id);
    } catch (err) {
      console.error("disconnect error:", err);
    }
  });
});

const PORT = process.env.PORT || 4000;
io.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

// Graceful shutdown
const shutdown = () => {
  console.log("Shutting down socket server...");
  io.close(() => {
    console.log("Socket.IO server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
