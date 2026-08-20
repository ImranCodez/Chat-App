const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendResponse = require("./responsehandler");
const { json } = require("express");

const generateAccsToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
   
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};
const generateRefToken = (user) => {
  return jwt.sign(
    { 
      user: user._id,
      email: user.email,
    
    },

    process.env.JWT_SECRET,
    { expiresIn: "15d" },
  );
};
const resetpassToken = () => {
  const resetToken = crypto.randomBytes(16).toString("hex");

  const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  
  return { resetPasswordToken, resetToken };
  // return Buffer.from(`${JSON.stringify(kisu_aktadeo)}`).toString("base64");
};

const hashverifytoken = (token) => {
  const hasverify = crypto.createHash("sha256").update(token).digest("hex");
  return hasverify;
  // return JSON.parse(Buffer.from(token, "base64").toString("utf-8"));
};
// .......verufytoken.....//
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.log("JWT Error:", error.message);
    return null;
  }
};

module.exports = {
  generateAccsToken,
  generateRefToken,
  resetpassToken,
  verifyToken,
  hashverifytoken,
};
