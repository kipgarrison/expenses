const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "5000"),
  debug: process.env.APP_DEBUG === "true",
  appSecret: process.env.APP_SECRET || "",
  logLevel: process.env.LOG_LEVEL || "info",
};

module.exports = config;
