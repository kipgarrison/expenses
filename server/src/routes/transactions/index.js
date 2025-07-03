const { Router } = require("express");
const { listTransactions, createTransaction, deleteTransaction, updateTransaction } = require('./controller');

const transactions = Router();

transactions.get("/", listTransactions);
transactions.delete("/:id", deleteTransaction);
transactions.post("/:id", updateTransaction);
transactions.put("/id", createTransaction);

module.exports = transactions;
