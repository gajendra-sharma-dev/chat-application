import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import { Server } from "socket.io";
const server = http.createServer(app);

const io = new Server(server);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle new messages
  socket.on("chat message", (msg) => {
    console.log("Message received:", msg);
    // Broadcast the message to all connected clients
    io.emit("chat message", msg);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

app.use(express.json({ limit: "16kb" })); // req.body se data max size  16kb. data json me hoga jo frontent se aayaga
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //yaha data html ke rup me aata hai usko samhe ke liye.
app.use(express.static("public"));

app.use(cookieParser());

import registerRouter from "./router/user.router.js";
import loginRouter from "./router/user.router.js";
import logoutRouter from "./router/user.router.js";
import updateDetailRouter from "./router/user.router.js";
import updatePasswordRouter from "./router/user.router.js";
import refreshAccessTokenRouter from "./router/user.router.js";
import getUserRouter from "./router/user.router.js";
import searchRouter from "./router/user.router.js";

import createRoomRouter from "./router/room.router.js";
import createGroupRouter from "./router/room.router.js";
import getAllRoomRouter from "./router/room.router.js";
import getRoomRouter from "./router/room.router.js";
import addMemeberRouter from "./router/room.router.js";
import leaveRoomRouter from "./router/room.router.js";

import sendMessageRouter from "./router/message.router.js";
import getMessageRouter from "./router/message.router.js";

app.use("/api/v1/users", registerRouter);
app.use("/api/v1/users", loginRouter);
app.use("/api/v1/users", logoutRouter);
app.use("/api/v1/users", updateDetailRouter);
app.use("/api/v1/users", updatePasswordRouter);
app.use("/api/v1/users", refreshAccessTokenRouter);
app.use("/api/v1/users", getUserRouter);
app.use("/api/v1/users", searchRouter);

app.use("/api/v1/users", createGroupRouter);
app.use("/api/v1/users", getAllRoomRouter);
app.use("/api/v1/users", createRoomRouter);
app.use("/api/v1/users", getRoomRouter);
app.use("/api/v1/users", addMemeberRouter);
app.use("/api/v1/users", leaveRoomRouter);

app.use("/api/v1/users", sendMessageRouter);
app.use("/api/v1/users", getMessageRouter);

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
  });
});

export default app;
