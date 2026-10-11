const test = require('node:test'); const assert = require('node:assert/strict');
const f = require('../src/services/fees');
const charges = [{ amount: 10000, description: 'Tuition', dueDate: '2026-09-01' }, { amount: 2500.5, description: 'Lunch', dueDate: '2026-09-01' }, { amount: 999, voided: true, description: 'Voided', dueDate: '2026-09-01' }];
const payments = [{ amount: 5000, paidOn: '2026-09-05', receiptNo: 'RCT-000001' }, { amount: 1000, voided: true, paidOn: '2026-09-06', receiptNo: 'RCT-000002' }];
test('balance ignores voided records', () => { assert.deepEqual(f.computeBalance(charges, payments), { charged: 12500.5, paid: 5000, balance: 7500.5 }); });
test('overpayment gives a negative balance', () => { assert.equal(f.computeBalance([{ amount: 100 }], [{ amount: 150 }]).balance, -50); });
test('rounding is exact to cents', () => { assert.equal(f.computeBalance([{ amount: 0.1 }, { amount: 0.2 }], []).charged, 0.3); });
test('statement has running balance and skips voided', () => {
  const s = f.buildStatement(charges, payments);
  assert.equal(s.length, 3); assert.equal(s[0].type, 'charge'); assert.equal(s[2].balance, 7500.5);
});
test('charge without a due date is dated by its creation date', () => {
  const s = f.buildStatement([{ amount: 10, description: 'X', dueDate: null, createdAt: new Date('2026-03-05T10:00:00Z') }], []);
  assert.equal(s[0].date, '2026-03-05');
});
