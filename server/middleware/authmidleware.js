const sendResponse = require("../helpers/responsehandler");
const { verifyToken } = require("../helpers/token");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) return sendResponse(res, 400, "Invalid 11111111 request");
    const decoded = verifyToken(token);
    if (!decoded) return sendResponse(res, 400, "Invalid 222222 request");
    req.user = decoded;
   next();
  } catch (error) {
   sendResponse(res, 400, "Invalid  3333 request");
    console.log(error);
  }
};
module.exports = { authMiddleware };
