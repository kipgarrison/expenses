const fs = require('fs/promises');
const logger = require("../logger");

let transactions;
const dataFilePath = './expenses.txt';

function addRunningTotal() {
  total = 0;
  localTrans = transactions.sort((a, b) => a.date > b.date ? 1 : (a.date == b.date ? a.id - b.id : -1));
  localTrans = localTrans.map((t, i) => {
    total = total + (t.type === "Credit" ? (-1 * t.amount) : t.amount);
    if (i === 73) return {};
    return { ...t, runningBalance: (Math.round(total * 100)) / 100 } //, year: t.date.getFullYear(), month: t.date.getMonth(), day: t.date.getDate() };
  });
  localTrans.sort((a, b) => a.date > b.date ? -1 : 1);
  transactions = localTrans;
}

function addPayments(items) {
  let localTrans = items ? [...items] : [...transactions];
  const totals = localTrans.reduce((acc, trans) => {
    const d1 = new Date(trans.date);
    const d = new Date(d1.getFullYear(), d1.getMonth() + 1, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}-1`;
    const newTotal = (acc[key] ?? 0) + trans.amount;
    return { ...acc, [key]: newTotal }
  }, {})
  nextId = localTrans.length + 1;
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
  if (items) {
    return localTrans;
  }
  transactions = localTrans;
}

function addTransaction(transaction) {
  const trans = { ...transaction, id: transactions.length };
  transactions = [...transactions, transaction];
  addRunningTotal();
}

function updateTransaction(transaction) {
  transactions = transactions.map(t => t.id === transaction.id ? transaction : t);
  addRunningTotal();
}

function deleteTransaction(id) {
  transactions.filter(t => t.id !== id);
  addRunningTotal();
}

function setTransactions(trans) {
  logger.info(`${trans.length} transactions loaded.`);
  transactions = trans;
  addRunningTotal();
}

(async () => {
  if (!transactions) {
    setTransactions(JSON.parse((await fs.readFile(dataFilePath, 'utf8')).toString()));
  }
}
)();

function getTransactions() {
  return transactions;
}

async function createTestData() {
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
      date,
      amount: amountRange.lower + amount + (getRandom(100) / 100),
      comments: getComments(),
      hasReceipt: getRandom(100) < hasReceiptPercentage,
      month: date.getMonth(),
      year: date.getFullYear(),
      day: date.getDate()
    })
  }
  items = addPayments(items);
  setTransactions(items);
  return items
}

function getDebits() {
  return transactions.filter(t => t.type === "Debit");
}

function getCredits() {
  return transactions.filter(t => t.type === "Credit");
}

module.exports = { getTransactions, addTransaction, updateTransaction, deleteTransaction, createTestData, getDebits, getCredits }
