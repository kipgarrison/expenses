const { Router } = require("express");
const transactions = require('./transactions');
const merchants = require('./merchants');
const budget = require('./budget');
const reference = require('./reference');
const { testData } = require("./testdata");

const v1 = new Router();

v1.use("/transactions", transactions)
v1.use("/merchants", merchants);
v1.use("/budget", budget);
v1.use("/reference", reference);
v1.use("/testdata", testData);

module.exports = v1;