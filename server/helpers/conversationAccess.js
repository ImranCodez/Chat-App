const conversationSchema = require("../models/conversationSchema");

const findUserConversation = (conversationId, userId) =>
  conversationSchema.findOne({
    _id: conversationId,
    $or: [{ creator: userId }, { participent: userId }],
  });

module.exports = { findUserConversation };
