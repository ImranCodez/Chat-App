const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const sendResponse = require("../helpers/responsehandler");

const userAuthSchema = new mongoose.Schema(
  { fullname:{
    type:String,
    required:true,
  },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true },
);

// 🔐 Hash password before save
userAuthSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  try {
    user.password = await bcrypt.hash(user.password, 10);
  } catch (err) {
    sendResponse(res, 500, "Internal server error");
  }
});

// 🔑 Compare password method.../
userAuthSchema.methods.comparePassword = async function (enteredPassword) {
  const user = this;
  return bcrypt.compare(enteredPassword, user.password);
};

module.exports = mongoose.model("user", userAuthSchema);
