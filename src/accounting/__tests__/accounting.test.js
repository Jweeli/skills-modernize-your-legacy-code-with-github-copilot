const fs = require('fs');
const path = require('path');

const STORAGE_FILE = path.resolve(__dirname, '..', 'balance.json');
const accounting = require('../accounting');

function resetStorage(value = 1000.0) {
  if (fs.existsSync(STORAGE_FILE)) fs.unlinkSync(STORAGE_FILE);
  fs.writeFileSync(STORAGE_FILE, JSON.stringify({ balance: Number(value) }, null, 2));
}

describe('Accounting business logic', () => {
  beforeEach(() => {
    resetStorage(1000.0);
  });

  test('TC-01: initial balance present and readable', () => {
    const bal = accounting.getBalance();
    expect(bal).toBeCloseTo(1000.0);
  });

  test('TC-04: credit account with valid amount', () => {
    const newBal = accounting.credit(25.5);
    expect(newBal).toBeCloseTo(1025.5);
    const stored = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
    expect(Number(stored.balance)).toBeCloseTo(1025.5);
  });

  test('TC-05: credit with zero or negative amount should throw', () => {
    expect(() => accounting.credit(0)).toThrow('Invalid amount');
    expect(() => accounting.credit(-10)).toThrow('Invalid amount');
  });

  test('TC-06: debit with valid amount less than balance', () => {
    const newBal = accounting.debit(100);
    expect(newBal).toBeCloseTo(900.0);
    const stored = JSON.parse(fs.readFileSync(STORAGE_FILE, 'utf8'));
    expect(Number(stored.balance)).toBeCloseTo(900.0);
  });

  test('TC-07: debit equal to balance zeros out', () => {
    resetStorage(50.0);
    const newBal = accounting.debit(50);
    expect(newBal).toBeCloseTo(0.0);
  });

  test('TC-08: debit exceeding balance throws insufficient funds', () => {
    expect(() => accounting.debit(1500)).toThrow('Insufficient funds');
  });

  test('TC-09: invalid numeric input throws', () => {
    expect(() => accounting.credit('abc')).toThrow('Invalid amount');
    expect(() => accounting.debit('xyz')).toThrow('Invalid amount');
  });
});
