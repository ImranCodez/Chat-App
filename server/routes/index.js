const express=require("express");
const authRoute=require("../routes/authRoute")
const comvRoute= require("./comvRoute");
const { authMiddleware } = require("../middleware/authmidleware");
const route=express.Router()

route.use("/auth",authRoute)
route.use("/conv",authMiddleware,comvRoute)


module.exports=route