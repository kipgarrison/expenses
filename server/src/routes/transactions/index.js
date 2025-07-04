const { Router } = require("express");
const { listTransactions, createTransaction, deleteTransaction, updateTransaction } = require('./controller');

const transactions = Router();

transactions.get("/", listTransactions);
transactions.delete("/:id", deleteTransaction);
transactions.post("/", createTransaction);
transactions.put("/:id", updateTransaction);

module.exports = transactions;
