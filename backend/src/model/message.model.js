import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    roomId: {
      type: mongoose.Types.ObjectId,
      ref: "Room",
    },
    text: {
      type: String,
      required: [true, "text is required"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
