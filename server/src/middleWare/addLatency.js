module.exports = (latency) => {
  return (req, res, next) => {
    setTimeout(() => next(), latency);
  }
}

