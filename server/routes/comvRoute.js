const express = require("express");
const { addFriend, conversation, Sendmessage, messageGet } = require("../controllers/convController");
const route = express.Router();
route.post("/addfriend", addFriend);
route.get("/list", conversation);
route.post("/sendmessage", Sendmessage);
route.get("/messageslist/:conversation", messageGet);

module.exports = route;
