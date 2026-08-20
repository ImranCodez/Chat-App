const sendResponse = require("../helpers/responsehandler");
const { generateAccsToken, generateRefToken } = require("../helpers/token");
    const userAuthSchema=require("../models/userSchema")

// ...........signup part...//
const signupuser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    if (!fullname) return sendResponse(res, 400, "fullname is required");
    if (!email) return sendResponse(res, 400, "email is required");
    if (!password) return sendResponse(res, 400, "password is required");
    const existingUser = await userAuthSchema.findOne({
      email: email.toLowerCase(),
    });
    if (existingUser)
      return sendResponse(
        res,
        400,
        true,
        "User already exists with this email",
      );
    const user = new userAuthSchema({
      fullname,
      email: email.toLowerCase(),
      password,
    });
    user.save();
    sendResponse(res, 201, "signup is successfull");
  } catch (error) {
    console.log(error);
    
    sendResponse(res, 500, false, "Internal server error");
  }
};
// ..signin part .....//
const signinuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return sendResponse(res, 400, "email is required");
    if (!password) return sendResponse(res, 400, "password is required");
    const existingUser = await userAuthSchema.findOne({ email });
    if (!existingUser)
      return sendResponse(res, 400, "with this email user not exist");
    const matchpass = await existingUser.comparePassword(password);
    if (!matchpass) return sendResponse(res, 400, "wrong password");
    const token = generateAccsToken(existingUser);
    const reftoken = generateRefToken(existingUser);
    const cookieAcsOptions = {
      httpOnly: false, // Prevents client-side JavaScript from accessing the cookie, mitigating XSS
      maxAge: 1000 * 60 * 40, // Cookie expiry time in milliseconds (e.g., 15 minutes)
      secure: false, // Ensures the cookie is only sent over HTTPS (set to false for local HTTP development)
    };
    const cookieRFcsOptions = {
      httpOnly: false,
      maxAge: 1296000000, // Cookie expiry time in milliseconds (e.g., 15 days)
      secure: false,
      // sameSite: 'Strict',
    };

    res.cookie("accessToken", token, cookieAcsOptions);
    res.cookie("x-Xreftoken", reftoken, cookieRFcsOptions);

    sendResponse(res, 200, "Login is succesfull", true);
  } catch (error) {
    console.log(error);
    sendResponse(res, 500, "Internal server error", false, error.message);
  }
};
const getprofile = async (req, res) => {
  try {
    const user = await userAuthSchema
      .findById(req.user.id)
      .select("-otp -updatedAt -otpExpires");
    if (!user) return sendResponse(res, 400, "Inavlid oigfgfgoiooon request");

    sendResponse(res, 200, "", true, user);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};module.exports = {
  signupuser,
  signinuser,
  getprofile,
};
