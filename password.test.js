const test = require('node:test'); const assert = require('node:assert/strict');
const { passwordProblems, generateTempPassword } = require('../src/services/passwordPolicy');
test('weak passwords are rejected', () => {
  assert.ok(passwordProblems('short1A').length > 0); assert.ok(passwordProblems('alllowercase123').some((m) => /uppercase/.test(m)));
  assert.ok(passwordProblems('NoDigitsHereAtAll').some((m) => /number/.test(m))); assert.ok(passwordProblems('Teacher.Mwangi1', 'teacher.mwangi').some((m) => /username/.test(m)));
});
test('strong password passes', () => { assert.deepEqual(passwordProblems('Blue-Horizon-2026'), []); });
test('generated temporary passwords always satisfy the policy and differ', () => {
  const seen = new Set();
  for (let i = 0; i < 200; i++) { const p = generateTempPassword(); assert.equal(p.length, 12); assert.deepEqual(passwordProblems(p), []); seen.add(p); }
  assert.ok(seen.size > 190);
});
