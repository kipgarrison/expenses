module.exports = (req, res, next) => {
  const uuid = crypto.randomUUID()
  req.requestId = uuid;
  next();
}

