class CustomError extends Error {
  message;
  statusCode;
  code;
  requestId;

  constructor({
    message,
    statusCode,
    code,
    requestId
  }) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.code = code;
    this.requestId = requestId;
  }
}

module.exports = CustomError;
