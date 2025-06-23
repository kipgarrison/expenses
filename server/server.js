const express = require('express')
const cors = require('cors');
const app = express()
const port = 3000
const bodyParser = require('body-parser');

let total = 6000;
let transactions = [
  {
    id: 1,
    date: new Date(),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 100.00,
    comments: 'Comments #1'
  },
  {
    id: 2,
    date: new Date('6/13/2025'),
    merchant: 'Target',
    type: 'Credit Card Debit',
    amount: 110.00,
    comments: 'Comments #2',
    hasReceipt: true
  },
  {
    id: 3,
    date: new Date('6/15/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 120.00,
    comments: 'Comments #3',
    hasReceipt: true
  },
  {
    id: 4,
    date: new Date('6/1/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 140.00,
    comments: 'Comments #4',
    hasReceipt: true
  },
  {
    id: 5,
    date: new Date(),
    merchant: 'Macy\'s',
    type: 'Credit Card Debit',
    amount: 166.66,
    comments: 'Comments #5'
  },
  {
    id: 6,

    date: new Date(),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 100.00,
    comments: 'Comments #6'
  },
  {
    id: 7,

    date: new Date('6/13/2025'),
    merchant: 'Target',
    type: 'Credit Card Debit',
    amount: 110.00,
    comments: 'Comments #7',
    hasReceipt: true
  },
  {
    id: 8,

    date: new Date('6/15/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 120.00,
    comments: 'Comments #8',
    hasReceipt: true
  },
  {
    id: 9,
    date: new Date('6/1/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 140.00,
    comments: 'Comments #9',
    hasReceipt: true
  },
  {
    id: 10,
    date: new Date(),
    merchant: 'Macy\'s',
    type: 'Credit Card Debit',
    amount: 166.66,
    comments: 'Comments #10'
  },
  {
    id: 11,

    date: new Date(),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 100.00,
    comments: 'Comments #11'
  },
  {
    id: 12,

    date: new Date('6/13/2025'),
    merchant: 'Target',
    type: 'Credit Card Debit',
    amount: 110.00,
    comments: 'Comments #12',
    hasReceipt: true
  },
  {
    id: 13,
    date: new Date('6/15/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 120.00,
    comments: 'Comments #13',
    hasReceipt: true
  },
  {
    id: 14,

    date: new Date('6/1/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 140.00,
    comments: 'Comments #14',
    hasReceipt: true
  },
  {
    id: 15,
    date: new Date(),
    merchant: 'Macy\'s',
    type: 'Credit Card Debit',
    amount: 166.66,
    comments: 'Comments #15'
  },
  {
    id: 16,

    date: new Date(),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 100.00,
    comments: 'Comments #16'
  },
  {
    id: 17,

    date: new Date('6/13/2025'),
    merchant: 'Target',
    type: 'Credit Card Debit',
    amount: 110.00,
    comments: 'Comments  #17',
    hasReceipt: true
  },
  {
    id: 18,

    date: new Date('6/15/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 120.00,
    comments: 'Comments #18',
    hasReceipt: true
  },
  {
    id: 19,

    date: new Date('6/1/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 140.00,
    comments: 'Comments #19',
    hasReceipt: true
  },
  {
    id: 20,

    date: new Date(),
    merchant: 'Macy\'s',
    type: 'Credit Card Debit',
    amount: 166.66,
    comments: 'Comments #20'
  },
  {
    id: 21,

    date: new Date(),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 100.00,
    comments: 'Comments #21'
  },
  {
    id: 22,

    date: new Date('6/13/2025'),
    merchant: 'Target',
    type: 'Credit Card Debit',
    amount: 110.00,
    comments: 'Comments #22',
    hasReceipt: true
  },
  {
    id: 23,

    date: new Date('6/15/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 120.00,
    comments: 'Comments #23',
    hasReceipt: true
  },
  {
    id: 24,

    date: new Date('6/1/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 140.00,
    comments: 'Comments #24',
    hasReceipt: true
  },
  {
    id: 25,

    date: new Date(),
    merchant: 'Macy\'s',
    type: 'Credit Card Debit',
    amount: 166.66,
    comments: 'Comments  #25'
  },
  {
    id: 26,

    date: new Date(),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 100.00,
    comments: 'Comments #26'
  },
  {
    id: 27,

    date: new Date('6/13/2025'),
    merchant: 'Target',
    type: 'Credit Card Debit',
    amount: 110.00,
    comments: 'Comments #27',
    hasReceipt: true
  },
  {
    id: 28,

    date: new Date('6/15/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 120.00,
    comments: 'Comments #28',
    hasReceipt: true
  },
  {
    id: 29,

    date: new Date('6/1/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 140.00,
    comments: 'Comments #29',
    hasReceipt: true
  },
  {
    id: 30,

    date: new Date(),
    merchant: 'Macy\'s',
    type: 'Credit Card Debit',
    amount: 166.66,
    comments: 'Comments #30'
  },
  {
    id: 31,

    date: new Date(),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 100.00,
    comments: 'Comments #31'
  },
  {
    id: 32,

    date: new Date('6/13/2025'),
    merchant: 'Target',
    type: 'Credit Card Debit',
    amount: 110.00,
    comments: 'Comments  #32',
    hasReceipt: true
  },
  {
    id: 33,

    date: new Date('6/15/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 120.00,
    comments: 'Comments #33',
    hasReceipt: true
  },
  {
    id: 34,

    date: new Date('6/1/2025'),
    merchant: 'Wal-Mart',
    type: 'Credit Card Debit',
    amount: 140.00,
    comments: 'Comments #34',
    hasReceipt: true
  },
  {
    id: 35,
    date: new Date(),
    merchant: 'Macy\'s',
    type: 'Credit Card Debit',
    amount: 166.66,
    comments: 'Comments #35'
  },
];

function addRunningBalance() {
  total = 10000;
  transactions = transactions.sort((a, b) => a.date > b.date ? 1 : -1).map(t => {
    total = total - t.amount;
    return { ...t, runningBalance: total }
  });
  transactions.sort((a, b) => a.date > b.date ? -1 : 1);
}

addRunningBalance();

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})