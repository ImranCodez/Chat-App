const sendResponse = require("../helpers/responsehandler");
const {
  generateAccsToken,
  generateRefToken,
  verifyToken,
} = require("../helpers/token");
const userAuthSchema = require("../models/userSchema");
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
    if (existingUser) {
      return sendResponse(res, 400, "User already exists with this email");
    }
    const user = new userAuthSchema({
      fullname,
      email: email.toLowerCase(),
      password,
    });
    await user.save();
    sendResponse(res, 201, "signup is successfull");
  } catch (error) {
    console.log(error);

    sendResponse(res, 500, "Internal server error", false);
  }
};
// ..signin part .....//
const signinuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) return sendResponse(res, 400, "email is required");
    if (!password) return sendResponse(res, 400, "password is required");
    const existingUser = await userAuthSchema.findOne({
      email: email.toLowerCase(),
    });
    if (!existingUser)
      return sendResponse(res, 400, "with this email user not exist");
    const matchpass = await existingUser.comparePassword(password);
    if (!matchpass) return sendResponse(res, 400, "wrong password");
    const token = generateAccsToken(existingUser);
    const reftoken = generateRefToken(existingUser);
    const cookieAcsOptions = {
      httpOnly: true, // Prevents client-side JavaScript from accessing the cookie, mitigating XSS
      maxAge: 1000 * 60 * 40, // Cookie expiry time in milliseconds (e.g., 15 minutes)
      secure: true, // Ensures the cookie is only sent over HTTPS (set to false for local HTTP development)
      sameSite: "none", // The local frontend and deployed API are different origins.
    };
    const cookieRFcsOptions = {
      httpOnly: true,
      maxAge: 1296000000, // Cookie expiry time in milliseconds (e.g., 15 days)
      secure: true,
      sameSite: "none",
    };

    res.cookie("accessToken", token, cookieAcsOptions);
    res.cookie("x-Xreftoken", reftoken, cookieRFcsOptions);

    sendResponse(res, 200, "Login is succesfull", true);
  } catch (error) {
    sendResponse(res, 500, "Internal server error", false, error.message);
  }
};
const getprofile = async (req, res) => {
  try {
    const user = await userAuthSchema
      .findById(req.user.id)
      .select(" -updatedAt  -password");
    if (!user) return sendResponse(res, 400, "Inavlid  request");

    sendResponse(res, 200, "", true, user);
  } catch (error) {
    sendResponse(res, 500, "Internal server error");
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies["x-Xreftoken"];
    if (!refreshToken) return sendResponse(res, 401, "Refresh token not found");

    const decoded = verifyToken(refreshToken);
    if (!decoded?.user) return sendResponse(res, 401, "Invalid refresh token");

    const user = await userAuthSchema
      .findById(decoded.user)
      .select("_id email");
    if (!user) return sendResponse(res, 401, "User not found");

    const accessToken = generateAccsToken(user);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 40,
      secure: true,
      sameSite: "none",
    });

    return sendResponse(res, 200, "Access token refreshed", true);
  } catch (error) {
    console.log(error);
    return sendResponse(res, 401, "Could not refresh access token");
  }
};

const logoutuser = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("x-Xreftoken", cookieOptions);
  return sendResponse(res, 200, "Logout successful", true);
};
module.exports = {
  signupuser,
  signinuser,
  getprofile,
  refreshAccessToken,
  logoutuser,
};
