const { readBalance, writeBalance } = require('./index');

function getBalance() {
  return Number(readBalance());
}

function credit(amount) {
  const a = Number(amount);
  if (isNaN(a) || a <= 0) {
    throw new Error('Invalid amount');
  }
  const bal = getBalance();
  const newBal = Number((bal + a).toFixed(2));
  writeBalance(newBal);
  return newBal;
}

function debit(amount) {
  const a = Number(amount);
  if (isNaN(a) || a <= 0) {
    throw new Error('Invalid amount');
  }
  const bal = getBalance();
  if (bal < a) {
    throw new Error('Insufficient funds');
  }
  const newBal = Number((bal - a).toFixed(2));
  writeBalance(newBal);
  return newBal;
}

module.exports = { getBalance, credit, debit };
