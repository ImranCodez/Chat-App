const sendResponse = require("../helpers/responsehandler");
const conversationSchema = require("../models/conversationSchema");
const messaegesSchema = require("../models/messaegesSchema");
const userSchema = require("../models/userSchema");
const { findUserConversation } = require("../helpers/conversationAccess");
const addFriend = async (req, res) => {
  try {
    const { email } = req.body;

    const currentUser = await userSchema.findById(req.user.id).select("email");
    if (!currentUser) return sendResponse(res, 401, "User not found");
    if (!email) return sendResponse(res, 400, "email is required");
    if (email === currentUser.email.toLowerCase())
      return sendResponse(res, 400, "You cannot add yourself");

    const friend = await userSchema.findOne({ email });
    if (!friend)
      return sendResponse(res, 400, "user with this email not exist");
    if (friend._id.toString() === req.user.id.toString())
      return sendResponse(res, 400, "You cannot add yourself");

    const existparticipent = await conversationSchema.findOne({
      $or: [
        { creator: req.user.id, participent: friend._id },
        { participent: req.user.id, creator: friend._id },
      ],
    });
    if (existparticipent)
      return sendResponse(res, 400, "already in frind list");
    const createconv = await conversationSchema.create({
      creator: req.user.id,
      participent: friend._id,
    });
    return sendResponse(res, 201, "added friend sauccessfully");
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
    console.log(error);
  }
};
const conversation = async (req, res) => {
  try {
    const conv = await conversationSchema
      .find({
        $and: [
          { $or: [{ creator: req.user.id }, { participent: req.user.id }] },
          { $expr: { $ne: ["$creator", "$participent"] } },
        ],
      })
      .populate("creator participent", "fullname email");
    return sendResponse(res, 200, "", true, conv);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Internal server error");
  }
};
const Sendmessage = async (req, res) => {
  try {
    const { content, conversation, contentype = "text" } = req.body;

    // 1. Validate input
    if (!content || !conversation) {
      return sendResponse(res, 400, "content and conversation are required");
    }

    // 2. Check conversation
    const existingConversation = await findUserConversation(
      conversation,
      req.user.id,
    );
    if (!existingConversation) {
      return sendResponse(res, 404, "conversation not found");
    }

    // 3. Save message
    const message = await messaegesSchema.create({
      content,
      contentype,
      conversation,
      sender: req.user.id,
    });

    // 4. Update last message
    existingConversation.lastmessage = content;

    await existingConversation.save();

    // 5. Send realtime message
    global.io.to(conversation).emit("new_message", message);

    // 6. Send response
    return sendResponse(res, 201, "sent hoise", message);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, "Internal server error");
  }
};
const messageGet = async (req, res) => {
  try {
    const { conversation } = req.params;
    if (!conversation) return sendResponse(res, 400, " conversation not found");
    const existingConversation = await findUserConversation(
      conversation,
      req.user.id,
    );
    if (!existingConversation)
      return sendResponse(res, 403, "conversation not found");
    const message = await messaegesSchema.find({ conversation });
    const visibleMessages = message.map((item) => {
      const messageData = item.toObject();
      const deletedForCurrentUser =
        Array.isArray(item.deletedFor) &&
        item.deletedFor.some(
          (userId) => String(userId) === String(req.user.id),
        );
      if (item.isDeletedForEveryone || deletedForCurrentUser) {
        messageData.content = "This message was deleted";
        messageData.isDeletedForMe = !item.isDeletedForEveryone;
      }
      return messageData;
    });
    sendResponse(res, 200, "", true, visibleMessages);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
    console.log(error);
  }
};

const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const mode = req.query.mode || req.body?.mode || "me";
    const message = await messaegesSchema.findById(messageId);

    if (!message) return sendResponse(res, 404, "message not found");
    const conversation = await findUserConversation(
      message.conversation,
      req.user.id,
    );

    if (!conversation) return sendResponse(res, 403, "conversation not found");

    if (!["me", "everyone"].includes(mode)) {
      return sendResponse(res, 400, "invalid delete mode");
    }

    if (mode === "everyone") {
      if (String(message.sender) !== String(req.user.id)) {
        return sendResponse(
          res,
          403,
          "you can only delete your own messages for everyone",
        );
      }
      message.isDeletedForEveryone = true;
      message.content = "This message was deleted";
    } else if (
      !Array.isArray(message.deletedFor) ||
      !message.deletedFor.some(
        (userId) => String(userId) === String(req.user.id),
      )
    ) {
      if (!Array.isArray(message.deletedFor)) message.deletedFor = [];
      message.deletedFor.push(req.user.id);
    }

    await message.save();

    if (mode === "everyone") {
      const latestMessage = await messaegesSchema
        .findOne({ conversation: message.conversation })
        .sort({ createdAt: -1 });
      conversation.lastmessage = latestMessage?.content || "null";
      await conversation.save();
    }

    if (mode === "everyone") {
      global.io.to(String(message.conversation)).emit("message_deleted", {
        messageId,
        conversationId: String(message.conversation),
        lastmessage: conversation.lastmessage,
        mode,
        message,
      });
    }

    const responseMessage = message.toObject();
    if (mode === "me") {
      responseMessage.content = "This message was deleted";
      responseMessage.isDeletedForMe = true;
    }

    return sendResponse(res, 200, "message deleted", true, {
      message: responseMessage,
      mode,
    });
  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, "Internal server error");
  }
};

const reactToMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    if (!emoji) return sendResponse(res, 400, "emoji is required");

    const message = await messaegesSchema.findById(messageId);
    if (!message) return sendResponse(res, 404, "message not found");

    const conversation = await findUserConversation(
      message.conversation,
      req.user.id,
    );
    if (!conversation) return sendResponse(res, 403, "conversation not found");

    if (!Array.isArray(message.reactions)) message.reactions = [];
    const existingReaction = message.reactions.find(
      (reaction) => String(reaction.user) === String(req.user.id),
    );
    if (existingReaction) {
      existingReaction.emoji = String(emoji);
    } else {
      message.reactions.push({ user: req.user.id, emoji: String(emoji) });
    }

    await message.save();
    global.io.to(String(message.conversation)).emit("message_reaction", {
      messageId,
      conversationId: String(message.conversation),
      reactions: message.reactions,
    });
    return sendResponse(res, 200, "reaction saved", true, message);
  } catch (error) {
    console.log(error);
    return sendResponse(
      res,
      500,
      error.message || "Could not save reaction",
      false,
    );
  }
};

module.exports = {
  addFriend,
  conversation,
  Sendmessage,
  messageGet,
  deleteMessage,
  reactToMessage,
};
