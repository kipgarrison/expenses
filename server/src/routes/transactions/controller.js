const data = require("../../data/transactions");
const CustomError = require("../../errors/CustomError");

const listTransactions = async (req, res) => {
  res.json(data.getTransactions());
};

const deleteTransaction = async (req, res) => {
  data.deleteTransaction(parseInt(req.params.id))
  res.sendStatus(204);
};

const updateTransaction = async (req, res) => {
  let trans = req.body;
  const tId = parseInt(trans.id);
  const id = parseInt(req.params.id);
  if (isNaN(tId) || isNaN(id) || id !== tId) {
    return res.sendStatus(400).send("Invalid id");
  }
  data.updateTransaction(trans);
  res.sendStatus(204);
};

const createTransaction = async (req, res) => {
  let trans = req.body;
  if (req.body.id !== 0) return res.status(400).send("bad request id is set");
  const created = data.addTransaction(trans);
  res.status(201).json(created);
};

module.exports = { listTransactions, deleteTransaction, updateTransaction, createTransaction }
