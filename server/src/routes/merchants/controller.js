const { getTransactions } = require("../../data/transactions");

const getMerchants = async (req, res) => {
  const upperLimit = new Date();
  const range = parseInt(req.params.range);
  const lowerLimit = isNaN(range) || !range ? new Date(1970, 1, 1) : new Date(upperLimit.getFullYear(), upperLimit.getMonth(), upperLimit.getDate() - range);
  const upperStr = upperLimit.toISOString();
  const lowerStr = lowerLimit.toISOString();
  const filterTrans = getTransactions().filter(t => t.date <= upperStr && t.date >= lowerStr);

  const summary = filterTrans.reduce((accumulator, trans) => {
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
  res.json(response);
}

module.exports = { getMerchants };