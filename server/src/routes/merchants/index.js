const { Router } = require("express");
const { getMerchants } = require('./controller');

const merchants = Router();
merchants.get("/:range", getMerchants);

module.exports = merchants;