const test = require('node:test'); const assert = require('node:assert/strict');
const { toCsv, cell } = require('../src/services/csv');
test('escapes quotes, commas and newlines', () => { assert.equal(cell('a,"b"'), '"a,""b"""'); assert.equal(cell('x\ny'), '"x\ny"'); });
test('neutralises spreadsheet formulas but keeps negative numbers', () => { assert.equal(cell('=SUM(A1)'), "'=SUM(A1)"); assert.equal(cell('@cmd'), "'@cmd"); assert.equal(cell(-5), '-5'); });
test('builds csv with BOM and header', () => {
  const out = toCsv([{ a: 1, b: 'x' }], [{ label: 'A', key: 'a' }, { label: 'B', value: (r) => r.b.toUpperCase() }]);
  assert.equal(out, '\uFEFFA,B\r\n1,X\r\n');
});
