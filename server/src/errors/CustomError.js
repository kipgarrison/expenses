class CustomError extends Error {
  message;
  statusCode;
  code;

  constructor({
    message,
    statusCode,
    code,
  }) {
    super();
    this.message = message;
    this.statusCode = statusCode;
    this.code = code;
  }
}

module.exports = CustomError;
