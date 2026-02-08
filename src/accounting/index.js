const fs = require('fs');
const path = require('path');
const readline = require('readline');

const STORAGE_FILE = path.resolve(__dirname, 'balance.json');

function readBalance() {
  if (!fs.existsSync(STORAGE_FILE)) {
    const initial = { balance: 1000.0 };
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(initial, null, 2));
    return initial.balance;
  }
  const raw = fs.readFileSync(STORAGE_FILE, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Number(parsed.balance) || 0.0;
  } catch (e) {
    return 0.0;
  }
}

function writeBalance(value) {
  const payload = { balance: Number(Number(value).toFixed(2)) };
  fs.writeFileSync(STORAGE_FILE, JSON.stringify(payload, null, 2));
}

function formatAmount(n) {
  return Number(n).toFixed(2);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function mainMenu() {
  let running = true;
  while (running) {
    console.log('--------------------------------');
    console.log('Account Management System');
    console.log('1. View Balance');
    console.log('2. Credit Account');
    console.log('3. Debit Account');
    console.log('4. Exit');
    console.log('--------------------------------');

    const choice = (await prompt('Enter your choice (1-4): ')).trim();
    switch (choice) {
      case '1':
        {
          const bal = readBalance();
          console.log('Current balance: ' + formatAmount(bal));
        }
        break;
      case '2':
        {
          const amtRaw = (await prompt('Enter credit amount: ')).trim();
          const amt = Number(amtRaw);
          if (isNaN(amt) || amt <= 0) {
            console.log('Invalid amount. Credit aborted.');
            break;
          }
          const bal = readBalance();
          const newBal = bal + amt;
          writeBalance(newBal);
          console.log('Amount credited. New balance: ' + formatAmount(newBal));
        }
        break;
      case '3':
        {
          const amtRaw = (await prompt('Enter debit amount: ')).trim();
          const amt = Number(amtRaw);
          if (isNaN(amt) || amt <= 0) {
            console.log('Invalid amount. Debit aborted.');
            break;
          }
          const bal = readBalance();
          if (bal >= amt) {
            const newBal = bal - amt;
            writeBalance(newBal);
            console.log('Amount debited. New balance: ' + formatAmount(newBal));
          } else {
            console.log('Insufficient funds for this debit.');
          }
        }
        break;
      case '4':
        running = false;
        break;
      default:
        console.log('Invalid choice, please select 1-4.');
    }
  }
  console.log('Exiting the program. Goodbye!');
  rl.close();
}

if (require.main === module) {
  mainMenu();
}

module.exports = { readBalance, writeBalance, formatAmount };
