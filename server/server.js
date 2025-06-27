const express = require('express')
const fs = require('fs/promises');
const cors = require('cors');
const app = express()
const port = 3000
const bodyParser = require('body-parser');

const budget = [
  { category: "Health & Wellness", amount: 250 },
  { category: "Utilities", amount: 500 },
  { category: "Eating Out", amount: 100 },
  { category: "Groceries", amount: 600 },
  { category: "Gas", amount: 200 },
  { category: "Education", amount: 50 },
  { category: "Fees", amount: 50 },
  { category: "Automotive", amount: 125 },
  { category: "Travel", amount: 100 },
  { category: "Home Goods", amount: 150 },
  { category: "Insurance", amount: 250 },
  { category: "Mortgage", amount: 500 },
  { category: "Pets", amount: 15 }
];

function addRunningBalance(transactions) {
  total = 0;
  transactions = transactions.sort((a, b) => a.date > b.date ? 1 : (a.date == b.date ? a.id - b.id : -1)).map(t => {
    total = total + t.amount;
    return { ...t, runningBalance: total }
  });
  transactions.sort((a, b) => a.date > b.date ? -1 : 1);
  return transactions;
}

async function loadTransactions() {
  let transactions = (await fs.readFile("./expense-data.txt")).toString();
  let json = addRunningBalance(JSON.parse(transactions));
  return json;
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
    addRunningBalance();
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
    addRunningBalance();
    res.sendStatus(204);
  }, 2000)

});

app.post("/api/v1/transactions", async (req, res) => {
  await setTimeout(() => {
    let trans = req.body;
    if (req.body.id !== 0) return res.status(400).send("bad request id is set");
    trans.id = transactions.length + 1;
    transactions = [...transactions, trans]
    addRunningBalance();
    res.status(201).json(transactions.find(t => t.id === trans.id));
  }, 2000)
});

app.get('/api/v1/merchants', async (req, res) => {
  const summary = transactions.reduce((accumulator, trans) => {
    let { merchants, totCount, totAmount } = accumulator;
    totCount += 1;
    totAmount = totAmount + trans.amount;
    if (merchants[trans.merchant]) {
      const curr = merchants[trans.merchant];
      const newCount = curr.totalCount + 1;
      const totalAmount = curr.totalAmount + trans.amount;
      return {
        merchants: {
          ...merchants,
          [trans.merchant]: {
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
          [trans.merchant]: {
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

app.get("/api/v1/budget", async (req, res) => {
  await setTimeout(() => {
    res.json(budget)
  }, 2000)
})
app.get('/api/v1/testdata', (req, res) => {
  const getRandom = (range) => {
    return Math.floor(Math.random() * range);
  }

  const getDate = (lowerYear) => {
    const days = (new Date().getFullYear() - lowerYear + 1) * 365;
    const d = new Date(`1/1/${lowerYear}`).setDate(getRandom(days));
    return new Date(d);
  }

  const getType = () => {
    const rnd = getRandom(100);
    return rnd <= types.creditCardDebit ? "Credit Card Debit" : "Credit Card Credi";
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
    { name: 'Wal-Mart', categories: ["Groceries", "Home Goods"] },
    { name: 'Target', categories: ["Groceries", "Home Goods"] },
    { name: 'Schnucks', categories: ["Grocery"] },
    { name: 'Wal-Greens', categories: ["Health & Wellsness", "Home Goods"] },
    { name: 'Dierbergs', categories: ["Groceries"] },
    { name: 'CVS', categories: ["Health & Wellness"] },
    { name: 'Amazon', categories: ["Shopping"] },
    { name: 'McDonalds', categories: ["Eating Out"] },
    { name: 'Sam\'s Club', categories: [["Groceries", "Home Goods"]] },
    { name: 'Sam\'s Club Gas', categories: ['Gas'] },
    { name: 'O\'Fallon IL', categories: ["Utilities"] },
    { name: 'Macys', categories: ["Home Goods"] },
    { name: 'Joes Exotic Pets', categories: ["Pets"] },
    { name: 'Menards', categories: ["Home Goods"] },
    { name: 'Cosco', categories: ["Groceries"] },
    { name: 'Lowes', categories: ["Home Goods"] },
    { name: 'Home Depot', categories: ["Home Goods"] },
    { name: 'Scott Credit Union', categories: ['Mortgage'] },
    { name: 'Plural Sight', categories: ['Education'] },
    { name: 'Kindle', categories: ['Entertainment', 'Education'] },
    { name: 'Chase', categories: ['Fees'] }
  ];

  const lowerDateYear = 2020;
  types = { creditCardDebit: 90, bankAccountDebit: 10 };
  amountRange = { lower: 25, upper: 600 };
  commentLengthRange = { lower: 5, upper: 25 };
  hasReceiptPercentage = 85;
  const items = [];
  for (let i = 0; i < 1000; i++) {
    const { name, categories } = merchants[getRandom(merchants.length)];
    const date = getDate(lowerDateYear);
    const type = getRandom(100);
    const amount = getRandom(amountRange.upper - amountRange.lower);
    const hasReceipt = getRandom(100);
    items.push({
      id: i,
      category: categories[getRandom(categories.length)],
      merchant: name,
      date: getDate(lowerDateYear),
      type: getType(),
      amount: amountRange.lower + amount + (getRandom(100) / 100),
      comments: getComments(),
      hasReceipt: getRandom(100) < hasReceiptPercentage
    })
  }
  res.json(items);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})