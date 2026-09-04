const express = require("express");
const {
  addFriend,
  conversation,
  Sendmessage,
  messageGet,
  deleteMessage,
} = require("../controllers/convController");
const route = express.Router();
route.post("/addfriend", addFriend);
route.get("/list", conversation);
route.post("/sendmessage", Sendmessage);
route.get("/messageslist/:conversation", messageGet);
route.delete("/message/:messageId", deleteMessage);
route.post("/message/:messageId/delete", deleteMessage);

module.exports = route;
