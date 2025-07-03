const { createTestData } = require("../../data/transactions");
const fs = require("fs/promises");

const setTestData = (req, res) => {
  createTestData();
  res.json({ ok: true });
}

module.exports = { setTestData };