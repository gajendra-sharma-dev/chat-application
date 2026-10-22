import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema(
  {
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    name: {
      type: String,
      required: true,
    },
    created_by: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
