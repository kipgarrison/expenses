const { Router } = require('express');
const { setTestData } = require("./controller");

const testData = Router();

testData.get("/", setTestData);

module.exports = { testData };
