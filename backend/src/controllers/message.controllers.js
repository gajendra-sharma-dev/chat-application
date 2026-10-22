import User from "../model/user.model.js";
import asynchandler from "../util/AsyncHandler.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import Room from "../model/room.model.js";
import mongoose from "mongoose";
import Message from "../model/message.model.js";

const sendMessage = asynchandler(async (req, res) => {
  const { roomId } = req.params;
  const { text } = req.body;

  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "room id is not correct from");
  }

  if (!text || text.trim() === "") {
    throw new ApiError(400, "text is required");
  }

  const room = await Room.findOne({ _id: roomId, members: req.user?._id });

  if (!room) {
    throw new ApiError(400, "you are not a member of this room");
  }

  let message = await Message.create({
    senderId: req.user?._id,
    roomId,
    text,
  });

  message = await message.populate("senderId", "username");

  return res
    .status(200)
    .json(new ApiResponse(200, "message sent successfully", message));
});

const getMessages = asynchandler(async (req, res) => {
  const { roomId } = req.params;

  const room = await Room.findOne({ _id: roomId, members: req.user._id });
  if (!room) throw new ApiError(403, "You are not a member of this room");

  const messages = await Message.find({ roomId })
    .populate("senderId", "username")
    .sort({ createdAt: 1 }); // purane pehle, naye baad me

  await Message.updateMany(
    { roomId, senderId: { $ne: req.user._id }, isRead: false },
    { $set: { isRead: true } },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, messages, "messages fetched"));
});

export { sendMessage, getMessages };
