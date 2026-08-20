const sendResponse = require("../helpers/responsehandler");
const conversationSchema = require("../models/conversationSchema");
const messaegesSchema = require("../models/messaegesSchema");
const userSchema = require("../models/userSchema");

const addFriend = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("myemail", email);

    if (email == req.user?.email)
      return sendResponse(res, 400, "tyr with another email");
    const friend = await userSchema.findOne({ email });
    if (!friend)
      return sendResponse(res, 400, "user with this email not exist");
    const existparticipent = await conversationSchema.findOne({
      $or: [
        { creator: req.user.id, participent: friend._id },
        { participent: req.user._id, creator: friend._id },
      ],
    });
    if (existparticipent)
      return sendResponse(res, 400, "already in frind list");
    console.log("user=>", req.user);
    const createconv = await conversationSchema.create({
      creator: req.user.id,
      participent: friend._id,
    });
    return sendResponse(res, 400, "added friend sauccessfully");
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
    console.log(error);
  }
};
const conversation = async (req, res) => {
  try {
    const conv = await conversationSchema.find({
      $or: [{ creator: req.user.id }, { participent: req.user.id }],
    }).populate("creator participent", "fullname email");
    return sendResponse(res, 200,"",true, conv);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Internal server error");
  }
};

const Sendmessage = async (req, res) => {
  try {
    const { content, conversation, contentype = "text" } = req.body;
    const isExistConversation = await conversationSchema.find({
      _id: conversation,
    });
    if (!isExistConversation)
      return sendResponse(res, 404, "conversation not found");
    const message = await messaegesSchema.create({
      content,
      contentype,
      conversation,
      sender: req.user.id,
    });
    global.io.to(conversation).emit("new_message",message)
    sendResponse(res, 201, "sent hoise");
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Internal server error");
  }
};
const messageGet = async (req, res) => {
  try {
    const { conversation } = req.params;
    if (!conversation) return sendResponse(res, 400, " conversation not found");
    const message = await messaegesSchema.find({conversation});
    sendResponse(res, 200, message);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
    console.log(error);
  }
};

module.exports = { addFriend, conversation, Sendmessage,messageGet };
