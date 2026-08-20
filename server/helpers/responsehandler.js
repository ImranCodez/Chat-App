const sendResponse = (res, statusCode = 200,message = '',success = true, data = null,error = null,) => {
  return res.status(statusCode).json({
    message,
    success,
    data,
    error,
  });
};
 module.exports=sendResponse