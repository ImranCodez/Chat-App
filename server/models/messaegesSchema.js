const mongoose = require("mongoose");
const messages = new mongoose.Schema(
  {
    contentype: {
      type: String,
      requred: true,
      default: "text",
      enum: ["text", "image", "video", "voice"],
    },
    content: {
      type: String,
      required: true,
    },
    sender: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    conversation: {
      type: mongoose.Types.ObjectId,
      ref: "convschema",
      required: true,
    },
    deletedFor: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    isDeletedForEveryone: {
      type: Boolean,
      default: false,
    },
    reactions: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "user",
          required: true,
        },
        emoji: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);
module.exports = mongoose.model("messages", messages);
