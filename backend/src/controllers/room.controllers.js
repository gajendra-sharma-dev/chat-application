import User from "../model/user.model.js";
import asynchandler from "../util/AsyncHandler.js";
import { ApiError } from "../util/ApiError.js";
import { ApiResponse } from "../util/ApiResponse.js";
import Room from "../model/room.model.js";
import mongoose from "mongoose";

const createRoom = asynchandler(async (req, res) => {
  const { userId } = req.body;
  const myId = req.user?._id;

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "user id is not correct format");
  }

  if (String(userId) === String(myId)) {
    throw new ApiError(400, "you can not chat yourself");
  }

  const user = await User.findById(userId);
  console.log(user);

  if (!user) {
    throw new ApiError(400, "user not found");
  }

  let room = await Room.findOne({
    isGroup: false,
    members: { $all: [userId, myId], $size: 2 },
  }).populate("members", "username email");

  console.log(room);

  if (!room) {
    room = await Room.create({
      isGroup: false,
      members: [userId, myId],
      created_by: myId,
    });
  }
  room = await room.populate("members", "username email");
  console.log(room);

  return res
    .status(200)
    .json(new ApiResponse(200, room, "room create successfully"));
});

const createRoomGroup = asynchandler(async (req, res) => {
  const { name, members } = req.body;

  if (!name || name.trim() === "") {
    throw new ApiError(400, "name is required");
  }

  if (!Array.isArray(members) || members.length < 1) {
    throw new ApiError(400, "add atleast one member in group");
  }

  const uniqueMembers = [
    ...new Set([...members.map(String), String(req.user?._id)]),
  ];

  const room = await Room.create({
    name,
    isGroup: true,
    members: uniqueMembers,
    created_by: req.user?._id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, room, "group create successfully"));
});

const getMyallroom = asynchandler(async (req, res) => {
  const rooms = await Room.find({ members: req.user?._id })
    .populate("members", "username email")
    .sort({ created_At: -1 });

  if (!rooms) {
    throw new ApiError(400, "user can not hold any room");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, rooms, "get all rooms of users successfully"));
});

const getRoomById = asynchandler(async (req, res) => {
  const { roomId } = req.params;
  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "room id is not correct from");
  }

  const room = await Room.findOne({
    _id: roomId,
    members: req.user?._id,
  }).populate("members", "username email");

  if (!room) {
    throw new ApiError(400, "room not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "room find successfully", room));
});

const addMembersInroom = asynchandler(async (req, res) => {
  const { roomId } = req.params;
  const { userId } = req.body;

  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "room id is not correct from");
  }

  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "user id is not correct from");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, "user not found");
  }

  const room = await Room.findOne({
    _id: roomId,
    isGroup: true,
    members: req.user._id,
  });

  if (!room) {
    throw new ApiError(400, "room not found");
  }

  const addMember = await Room.updateOne(
    { _id: roomId },
    { $addToSet: { members: userId } },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, addMember, "member add successfully"));
});

const leaveRoom = asynchandler(async (req, res) => {
  const { roomId } = req.params;

  if (!mongoose.isValidObjectId(roomId)) {
    throw new ApiError(400, "room id is not correct from");
  }

  const room = await Room.findOne({
    _id: roomId,
    isGroup: true,
    members: req.user?._id,
  });

  if (!room) {
    throw new ApiError(400, "room not found");
  }
  await Room.updateOne({ _id: roomId }, { $pull: { members: req.user?._id } });

  return res.status(200).json(new ApiResponse(200, "you left the group"));
});

export {
  createRoom,
  createRoomGroup,
  getMyallroom,
  getRoomById,
  addMembersInroom,
  leaveRoom,
};
