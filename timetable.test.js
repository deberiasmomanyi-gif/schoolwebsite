const test = require('node:test'); const assert = require('node:assert/strict');
const { findConflicts } = require('../src/services/timetable');
const existing = [{ classId: 'c1', staffId: 't1', room: 'Lab 1' }, { classId: 'c2', staffId: 't2', room: 'Room 4' }];
test('detects teacher and room clashes in other classes', () => {
  assert.deepEqual(findConflicts(existing, { classId: 'c3', staffId: 't1', room: 'room 9' }).map((x) => x.type), ['teacher']);
  assert.deepEqual(findConflicts(existing, { classId: 'c3', staffId: 't9', room: ' lab 1 ' }).map((x) => x.type), ['room']);
  assert.equal(findConflicts(existing, { classId: 'c3', staffId: 't1', room: 'Room 4' }).length, 2);
});
test('replacing the same class slot is not a conflict', () => { assert.equal(findConflicts(existing, { classId: 'c1', staffId: 't1', room: 'Lab 1' }).length, 0); });
test('no teacher or room means no clash', () => { assert.equal(findConflicts(existing, { classId: 'c3', staffId: null, room: '' }).length, 0); });
