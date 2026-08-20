const express=require("express");
const { signupuser, signinuser, getprofile } = require("../controllers/AuthControlller");
const { authMiddleware } = require("../middleware/authmidleware");
const route=express.Router()

route.post("/signup",signupuser)
route.post("/signin",signinuser)
route.get("/profile",authMiddleware,getprofile)


module.exports=route