const { Router } = require("express");
const { getMonthlyTotals, getDailyTotals, getMonthYears } = require("./controller");

const budget = Router();

budget.get("/months", getMonthYears)
budget.get("/:year/:month", getMonthlyTotals);
budget.get("/daily/:year/:month", getDailyTotals)

module.exports = budget