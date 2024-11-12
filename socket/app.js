import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "https://100-acre-z5d7.vercel.app",
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExits = onlineUser.find((user) => user.userId === userId);
  if (!userExits) {
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
    addUser(userId, socket.id);
    console.log(`${userId} connected with socket id: ${socket.id}`);
  });

  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver && receiver.socketId) {
      io.to(receiver.socketId).emit("getMessage", data);
      // console.log(`Message sent to user: ${receiverId}`);
    } else {
      // console.log(`User with ID ${receiverId} not found or not online`);
    }
  });

  
  socket.on("disconnect", () => {
    removeUser(socket.id);
    // console.log(`User with socket id: ${socket.id} disconnected`);
  });
});

const PORT = process.env.PORT || 4000;
io.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});

