const express = require("express");
const {
  addFriend,
  conversation,
  Sendmessage,
  messageGet,
  deleteMessage,
  reactToMessage,
} = require("../controllers/convController");
const route = express.Router();
route.post("/addfriend", addFriend);
route.get("/list", conversation);
route.post("/sendmessage", Sendmessage);
route.get("/messageslist/:conversation", messageGet);
route.delete("/message/:messageId", deleteMessage);
route.post("/message/:messageId/delete", deleteMessage);
route.post("/message/:messageId/react", reactToMessage);
route.post("/message/:messageId/reaction", reactToMessage);

module.exports = route;
