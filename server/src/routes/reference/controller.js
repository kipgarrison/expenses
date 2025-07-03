const { getTransactions } = require('../../data/transactions');
const _ = require('lodash');

const getMerchants = async (req, res) => {
  const merchants = getTransactions().map(t => t.merchant);
  const mers = _.uniqBy(merchants, "id").filter(m => !!m);
  mers.sort((a, b) => a.name > b.name ? 1 : -1);
  res.json([... new Set(mers)]);
};

const getCategories = async (req, res) => {
  const categories = getTransactions().map(t => t.category);
  const cats = _.uniqBy(categories, "id").filter(c => !!c);
  cats.sort((a, b) => a.name > b.name ? 1 : -1);
  res.json([...new Set(cats)]);
};

module.exports = { getMerchants, getCategories }