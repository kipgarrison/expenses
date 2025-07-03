const { Router } = require("express");
const { getCategories, getMerchants } = require("./controller");

const reference = Router();

reference.get("/merchants", getMerchants);
reference.get("/categories", getCategories);

module.exports = reference;