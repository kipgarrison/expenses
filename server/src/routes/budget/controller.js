const { getDebits, getTransactions } = require("../../data/transactions");
const _ = require('lodash');

const budget = [
  { category: "Health & Wellness", budgeted: 250 },
  { category: "Utilities", budgeted: 500 },
  { category: "Eating Out", budgeted: 100 },
  { category: "Groceries", budgeted: 600 },
  { category: "Gas", budgeted: 200 },
  { category: "Education", budgeted: 50 },
  { category: "Fees", budgeted: 50 },
  { category: "Automotive", budgeted: 125 },
  { category: "Travel", budgeted: 100 },
  { category: "Home Goods", budgeted: 150 },
  { category: "Insurance", budgeted: 250 },
  { category: "Mortgage", budgeted: 500 },
  { category: "Pets", budgeted: 15 }
];

const getMonthYears = async (req, res) => {
  const minYear = getDebits().reduce((a, t) => Math.min(a, t.year), 20000);

  const monthYears = [];
  for (let yr = new Date().getFullYear(); yr >= minYear; yr--) {
    for (let mo = 12; mo >= 1; mo--) {
      monthYears.push({ month: mo, year: yr });
    }
  }
  res.json(monthYears);
};

const getMonthlyTotals = async (req, res) => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  if (isNaN(year) || isNaN(month)) res.sendStatus(400).send("Year and month should be numeric");
  if (month < 1 || month > 12) res.sendStatus(400).send("Month should be between 1 and 12");
  const minYear = getTransactions().reduce((m, t) => Math.min(new Date(t.date).getFullYear(), m), 20000);
  if (year < minYear) res.sendStatus(400).send("Year specified is before start of transaction history");

  const filteredTrans = getTransactions().filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === year && (date.getMonth() - 1) === month && t.type === "Debit";
  });

  const budgetTotals = filteredTrans.reduce((acc, trans) => {
    const catTotals = acc[trans.category.name] ?? { transactions: 0, actual: 0 }
    return {
      ...acc,
      [trans.category.name]: { transactions: catTotals.transactions + 1, actual: catTotals.actual + trans.amount }
    }
  }, {});

  const lineItems = budget.map(b => {
    const actual = budgetTotals[b.category] || { tranactions: 0, actual: 0 };
    return { ...b, ...actual };
  });

  const totals = lineItems.reduce((acc, li) => ({ budgeted: acc.budgeted + li.budgeted, actual: acc.actual + li.actual }), { budgeted: 0, actual: 0 });
  const startDate = new Date(year, month, 1, 1);
  const endDate = new Date(year, month + 1, -1)

  res.json({ startDate, endDate, lineItems, ...totals });
};

const getDailyTotals = async (req, res) => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);

  // grab all transactions for the request month regardless of year
  const ymTrans = getDebits().filter(t => t.month === month);

  // sum amounts by day for request year and over all by day
  const { reqYear, totals } = ymTrans.reduce((a, t) => {
    let { reqYear, totals } = a;
    const reqYrAmt = (reqYear[t.day] ?? 0) + t.amount;
    const totalAmt = (totals[t.day] ?? 0) + t.amount;
    reqYear = t.year === year ? { ...reqYear, [t.day]: reqYrAmt } : reqYear;
    totals = { ...totals, [t.day]: totalAmt };
    return { reqYear, totals }
  }, { reqYear: {}, totals: {} });

  // figure out how  many years of data there is
  const { maxYear, minYear } = getDebits().reduce((a, t) => {
    return { maxYear: Math.max(t.year, a.maxYear), minYear: Math.min(t.year, a.minYear) }
  }, { maxYear: 0, minYear: 3000 });
  const years = maxYear - minYear + 1;

  // compute running total for budget 
  const totalBudget = budget.reduce((a, b) => a + b.budgeted, 0);
  const days = new Date(year, month, 0).getDate();
  const perDay = totalBudget / days;
  const dailyBudget = _.range(1, days + 1).map(d => ({ day: d, budgeted: perDay * d }));

  const results = Object.keys(dailyBudget).map(d => ({ day: d, req: reqYear[d] ?? 0, avg: (totals[d] ?? 0) / years, budgeted: dailyBudget[d].budgeted }));

  let actual = 0;
  let average = 0;
  const cummResults = results.map(r => {
    actual += r.req;
    average += r.avg;
    day = parseInt(r.day) + 1;
    return { date: `${month}/${day}`, budgeted: r.budgeted, actual, average };
  })
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const today = new Date();
  const daysRemaining = Math.ceil((lastDay.getTime() - firstDay.getTime()) / (1000 * 60 * 60 * 24));

  const status = firstDay <= today && lastDay >= today ? "In Progress" : (firstDay >= today ? "Future" : "Past");
  const monthlyTotal = cummResults[cummResults.length - 1].actual;
  const balance = totalBudget > monthlyTotal ? totalBudget - monthlyTotal : 0;
  const perDayRemaining = Math.floor(balance / daysRemaining);
  const currentPace = Math.floor(monthlyTotal / today.getDate()) * lastDay.getDate();
  res.json({ status, balance, perDay: perDayRemaining, currentPace, daily: cummResults });
};

module.exports = { getMonthYears, getMonthlyTotals, getDailyTotals }