const CustomError = require('../errors/CustomError');
const config = require('../config');
const logger = require('../logger');

module.exports = (error, req, res, next) => {
  function getErrorMessage(error) {
    if (error instanceof Error) {
      return error.message;
    }
    if (error && typeof error === "object" && "message" in error) {
      return String(error.message);
    }
    if (typeof error === "string") {
      return error;
    }
    return "An error occurred";
  }

  //logger.error(getErrorMessage(error), { requestId: req.requestId });
  logger.error(error, { requestId: req.requestId });

  // if (res.headersSent || config.env === "development") {
  //   next(error);
  //   return;
  // }

  if (error instanceof CustomError) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
        requestId: error.requestId
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      message: getErrorMessage(error) || "An error occurred. Please view logs for more details",
      stack: error.stack,
      requestId: req.requestId
    },
  });
}
