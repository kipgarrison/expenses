const express = require('express')
const fs = require('fs/promises');
const cors = require('cors');
const app = express()
const port = 3000
const bodyParser = require('body-parser');
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

function addRunningTotal(transactions) {
  total = 0;
  localTrans = transactions.sort((a, b) => a.date > b.date ? 1 : (a.date == b.date ? a.id - b.id : -1));
  transactions = localTrans.map(t => {
    total = total + (t.type === "Credit" ? (-1 * t.amount) : t.amount);
    dateParts = t.date ? t.date.split("-") : [0, 0, 0];
    return { ...t, runningBalance: (Math.round(total * 100)) / 100, year: parseInt(dateParts[0]), month: parseInt(dateParts[1]), day: parseInt(dateParts[2]) };
  });
  transactions.sort((a, b) => a.date > b.date ? -1 : 1);
  return transactions;
}

async function loadTransactions() {
  let transactions = (await fs.readFile("./expenses.txt")).toString();
  let json = addRunningTotal(JSON.parse(transactions));
  return json;
}

function addPayments(transactions) {
  let localTrans = [...transactions];
  const totals = transactions.reduce((acc, trans) => {
    const d1 = new Date(trans.date);
    const d = new Date(d1.getFullYear(), d1.getMonth() + 1, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-1`;
    const newTotal = (acc[key] ?? 0) + trans.amount;
    return { ...acc, [key]: newTotal }
  }, {})
  nextId = transactions.length + 1;
  Object.keys(totals).forEach(t => {
    const date = new Date(t);
    localTrans.push({
      id: nextId++,
      type: "Credit",
      category: { id: 0, name: "Payment" },
      merchant: { id: 0, name: "N/A" },
      date,
      amount: totals[t],
      comments: `Payment for ${date.getMonth()}/${date.getFullYear()}`
    });
  })
  return localTrans;
}

(async () => transactions = await loadTransactions())();

app.use(cors());
app.use(bodyParser.json());

app.get('/api/v1/transactions', async (req, res) => {

  await setTimeout(() => res.json(transactions), 5000);
});

app.delete("/api/v1/transactions/:id", async (req, res) => {
  await setTimeout(() => {
    transactions = transactions.filter(t => t.id !== parseInt(req.params["id"]))
    addRunningTotal(transactions);
    res.sendStatus(204);
  }, 2000);
});

app.put("/api/v1/transactions/:id", async (req, res) => {
  await setTimeout(() => {
    let trans = req.body;
    const tId = parseInt(trans.id);
    const id = parseInt(req.params.id);
    if (isNaN(tId) || isNaN(id) || id !== tId) {
      return res.sendStatus(400).send("Invalid id");
    }
    transactions = transactions.map(t => t.id === tId ? trans : t);
    addRunningTotal(transactions);
    res.sendStatus(204);
  }, 2000)

});

app.post("/api/v1/transactions", async (req, res) => {
  await setTimeout(() => {
    let trans = req.body;
    if (req.body.id !== 0) return res.status(400).send("bad request id is set");
    trans.id = transactions.length + 1;
    transactions = [trans, ...transactions]
    addRunningTotal(transactions);
    res.status(201).json(transactions.find(t => t.id === trans.id));
  }, 2000)
});

app.get('/api/v1/merchants', async (req, res) => {
  const summary = transactions.reduce((accumulator, trans) => {
    let { merchants, totCount, totAmount } = accumulator;
    totCount += 1;
    totAmount = totAmount + trans.amount;
    if (merchants[trans.merchant.name]) {
      const curr = merchants[trans.merchant.name];
      const newCount = curr.totalCount + 1;
      const totalAmount = curr.totalAmount + trans.amount;
      return {
        merchants: {
          ...merchants,
          [trans.merchant.name]: {
            totalCount: newCount,
            totalAmount: totalAmount,
            avgAmount: totalAmount / newCount,
            firstDate: trans.date < curr.firstDate ? trans.date : curr.firstDate,
            lastDate: trans.date > curr.firstDate ? trans.date : curr.lastDate,
            lastAmount: trans.amount
          }
        },
        totCount,
        totAmount
      }
    } else {
      return {
        merchants: {
          ...merchants,
          [trans.merchant.name]: {
            totalCount: 1,
            totalAmount: trans.amount,
            avgAmount: trans.amount,
            firstDate: trans.date,
            lastDate: trans.date,
            lastAmount: trans.amount
          }
        },
        totCount,
        totAmount
      }
    }
  }, { merchants: {}, totCount: 0, totAmount: 0 });

  const { merchants, totCount, totAmount } = summary;
  const response = Object.keys(merchants).map(name => {
    const mct = merchants[name];
    const totCountPct = Math.round((mct.totalCount / totCount) * 1000) / 10;
    const totAmountPct = Math.round((mct.totalAmount / totAmount) * 1000) / 10;
    return { name, ...mct, totAmountPct, totCountPct };
  });
  response.sort((a, b) => a.name > b.name ? -1 : 1);
  await setTimeout(() => res.json(response), 5000);

})

app.get("/api/v1/budget/months", async (req, res) => {
  const minYear = transactions.reduce((a, t) => Math.min(a, new Date(t.date).getFullYear()), 20000);

  const monthYears = [];
  for (let yr = new Date().getFullYear(); yr >= minYear; yr--) {
    for (let mo = 12; mo >= 1; mo--) {
      monthYears.push({ month: mo, year: yr });
    }
  }
  res.send(monthYears);
});

app.get("/api/v1/budget/:year/:month", async (req, res) => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);
  if (isNaN(year) || isNaN(month)) res.sendStatus(400).send("Year and month should be numeric");
  if (month < 1 || month > 12) res.sendStatus(400).send("Month should be between 1 and 12");
  const minYear = transactions.reduce((m, t) => Math.min(new Date(t.date).getFullYear(), m), 20000);
  if (year < minYear) res.sendStatus(400).send("Year specified is before start of transaction history");

  const filteredTrans = transactions.filter(t => {
    const date = new Date(t.date);
    return date.getFullYear() === year && (date.getMonth() - 1) === month;
  });

  const budgetTotals = filteredTrans.reduce((acc, trans) => {
    const catTotals = acc[trans.category] ?? { transactions: 0, actual: 0 }
    return {
      ...acc,
      [trans.category]: { transactions: catTotals.transactions + 1, actual: catTotals.actual + trans.amount }
    }
  }, {});

  const lineItems = budget.map(b => {
    const actual = budgetTotals[b.category] || { tranactions: 0, actual: 0 };
    return { ...b, ...actual };
  });

  const totals = lineItems.reduce((acc, li) => ({ budgeted: acc.budgeted + li.budgeted, actual: acc.actual + li.actual }), { budgeted: 0, actual: 0 });
  const startDate = new Date(year, month, 1, 1);
  const endDate = new Date(year, month + 1, -1)

  await setTimeout(() => {
    res.json({ startDate, endDate, lineItems, ...totals });
  }, 2000)
});


app.get('/api/v1/testdata', (req, res) => {
  const getRandom = (range) => {
    return Math.floor(Math.random() * range);
  }

  const getDate = (lowerYear) => {
    const days = (new Date().getFullYear() - lowerYear + 1) * 365;
    const d = new Date(`1/1/${lowerYear}`).setDate(getRandom(days));
    return new Date(d);
  }

  const getComments = () => {
    commentSource = "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.".split(" ");
    const length = getRandom(commentLengthRange.upper - commentLengthRange.lower);
    const words = [];
    for (let x = 0; x < length; ++x) {
      words.push(commentSource[getRandom(length)]);
    }
    return words.join(" ");
  }

  const merchants = [
    { id: 1, name: 'Wal-Mart', category: { id: 1, name: "Groceries" } },
    { id: 2, name: 'Target', category: { id: 2, name: "Home Goods" } },
    { id: 3, name: 'Schnucks', category: { id: 1, name: "Groceries" } },
    { id: 4, name: 'Wal-Greens', category: { id: 3, name: "Health & Wellness" } },
    { id: 5, name: 'Dierbergs', category: { id: 1, name: "Groceries" } },
    { id: 6, name: 'CVS', category: { id: 3, name: "Health & Wellness" } },
    { id: 7, name: 'Amazon', category: { id: 4, name: "Shopping" } },
    { id: 8, name: 'McDonalds', category: { id: 5, name: "Eating Out" } },
    { id: 9, name: 'Sam\'s Club', category: { id: 1, name: "Groceries" } },
    { id: 10, name: 'Sam\'s Club Gas', category: { id: 6, name: 'Gas' } },
    { id: 11, name: 'O\'Fallon IL', category: { id: 7, name: "Utilities" } },
    { id: 12, name: 'Macys', category: { id: 2, name: "Home Goods" } },
    { id: 13, name: 'Joes Exotic Pets', category: { id: 8, name: "Pets" } },
    { id: 14, name: 'Menards', category: { id: 2, name: "Home Goods" } },
    { id: 15, name: 'Cosco', category: { id: 1, name: "Groceries" } },
    { id: 16, name: 'Lowes', category: { id: 2, name: "Home Goods" } },
    { id: 17, name: 'Home Depot', category: { id: 2, name: "Home Goods" } },
    { id: 18, name: 'Scott Credit Union', category: { id: 9, name: 'Mortgage' } },
    { id: 19, name: 'Plural Sight', category: { id: 10, name: 'Education' } },
    { id: 20, name: 'Kindle', category: { id: 11, name: 'Entertainment' } },
    { id: 21, name: 'Chase', category: { id: 12, name: 'Fees' } }
  ];

  const lowerDateYear = 2020;
  types = { creditCardDebit: 90, bankAccountDebit: 10 };
  amountRange = { lower: 25, upper: 600 };
  commentLengthRange = { lower: 5, upper: 25 };
  hasReceiptPercentage = 85;
  let items = [];
  for (let i = 1; i <= 2000; i++) {
    const { id, name, category } = merchants[getRandom(merchants.length)];
    const date = getDate(lowerDateYear);
    const type = getRandom(100);
    const amount = getRandom(amountRange.upper - amountRange.lower);
    const hasReceipt = getRandom(100);
    items.push({
      id: i,
      category,
      type: "Debit",
      merchant: { id, name },
      date: getDate(lowerDateYear),
      amount: amountRange.lower + amount + (getRandom(100) / 100),
      comments: getComments(),
      hasReceipt: getRandom(100) < hasReceiptPercentage
    })
  }
  items = addPayments(items);
  res.json(items);
});

app.get("/api/v1/budget/daily/:year/:month", async (req, res) => {
  const year = parseInt(req.params.year);
  const month = parseInt(req.params.month);

  // grab all transactions for the request month regardless of year
  const ymTrans = transactions.filter(t => t.month === month);

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
  const { maxYear, minYear } = transactions.reduce((a, t) => {
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
});

app.get("/api/v1/reference/merchants", (req, res) => {
  const merchants = transactions.map(t => t.merchant);
  const mers = _.uniqBy(merchants, "id")
  mers.sort((a, b) => a.name > b.name ? 1 : -1);
  res.json([... new Set(mers)]);
});

app.get("/api/v1/reference/categories", (req, res) => {
  const categories = transactions.map(t => t.category);
  const cats = _.uniqBy(categories, "id");
  cats.sort((a, b) => a.name > b.name ? 1 : -1);
  res.json([...new Set(cats)]);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})