const mongoose = require("mongoose");
const convschema = new mongoose.Schema(
  {
    creator: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    participent: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    lastmessage: {
      type: String,
      default:"null",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("convschema", convschema);
