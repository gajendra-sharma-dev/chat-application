import mongoose, { Schema } from "mongoose";

const roomSchema = new Schema(
  {
    members: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Room = mongoose.model("Room", roomSchema);

export default Room;
