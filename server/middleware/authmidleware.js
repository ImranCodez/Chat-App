const sendResponse = require("../helpers/responsehandler");
const { verifyToken } = require("../helpers/token");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return sendResponse(res, 401, "Access token required");

    const decoded = verifyToken(token);

    if (!decoded) return sendResponse(res, 401, "Access token expired");
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse(res, 401, "Invalid access token");
  }
};
module.exports = { authMiddleware };
