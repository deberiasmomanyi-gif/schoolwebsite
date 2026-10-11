const test = require('node:test'); const assert = require('node:assert/strict');
const g = require('../src/services/grading');
const bands = [{ minPercent: 0, gradeLabel: 'E' }, { minPercent: 40, gradeLabel: 'C' }, { minPercent: 70, gradeLabel: 'B' }, { minPercent: 80, gradeLabel: 'A' }];
test('percentage', () => { assert.equal(g.percentage(45, 60), 75); assert.equal(g.percentage(1, 3), 33.33); assert.equal(g.percentage(null, 60), null); assert.equal(g.percentage(5, 0), null); });
test('score validation', () => {
  assert.equal(g.validateScore(null, 50), null); assert.equal(g.validateScore(50, 50), null);
  assert.match(g.validateScore(51, 50), /more than/); assert.match(g.validateScore(-1, 50), /negative/); assert.match(g.validateScore(10.123, 50), /decimal/);
});
test('grade bands pick the highest band reached', () => {
  assert.equal(g.gradeFor(80, bands).gradeLabel, 'A'); assert.equal(g.gradeFor(79.99, bands).gradeLabel, 'B');
  assert.equal(g.gradeFor(0, bands).gradeLabel, 'E'); assert.equal(g.gradeFor(null, bands), null);
});
test('band validation', () => {
  assert.deepEqual(g.validateBands(bands), []);
  assert.ok(g.validateBands([{ minPercent: 50, gradeLabel: 'A' }]).some((e) => /start at 0/.test(e)));
  assert.ok(g.validateBands([{ minPercent: 0, gradeLabel: 'A' }, { minPercent: 0, gradeLabel: 'B' }]).some((e) => /same minimum/.test(e)));
  assert.ok(g.validateBands([]).length > 0);
});
test('summarise ignores absent and empty scores', () => {
  const s = g.summarise([{ score: 40, max: 50 }, { score: 30, max: 50 }, { score: null, max: 50 }, { score: 0, max: 50, absent: true }]);
  assert.deepEqual(s, { totalScore: 70, totalMax: 100, percentage: 70 });
  assert.equal(g.summarise([]).percentage, null);
});
test('ranking shares positions for ties', () => {
  const r = g.rankWithTies([{ id: 'a', percentage: 90 }, { id: 'b', percentage: 80 }, { id: 'c', percentage: 80 }, { id: 'd', percentage: 70 }, { id: 'e', percentage: null }]);
  assert.deepEqual([...r.entries()], [['a', 1], ['b', 2], ['c', 2], ['d', 4], ['e', null]]);
});
