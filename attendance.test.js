const test = require('node:test'); const assert = require('node:assert/strict');
const a = require('../src/services/attendance'); const d = require('../src/services/dates');
test('attendance percentage excludes excused days', () => {
  assert.equal(a.attendancePercentage({ present: 8, late: 1, absent: 1, excused: 5 }), 90);
  assert.equal(a.attendancePercentage({ present: 0, late: 0, absent: 0, excused: 3 }), null);
  assert.equal(a.attendancePercentage({ present: 1, late: 0, absent: 2 }), 33.3);
});
test('tally counts each status', () => {
  const t = a.tally([{ status: 'present' }, { status: 'present' }, { status: 'absent' }, { status: 'late' }, { status: 'excused' }]);
  assert.equal(t.total, 5); assert.equal(t.percentage, 75);
});
test('edit window rules', () => {
  const base = { today: '2026-10-10', windowDays: 1 };
  assert.equal(a.canEditAttendance({ ...base, role: 'teacher', sessionDate: '2026-10-10' }), true);
  assert.equal(a.canEditAttendance({ ...base, role: 'teacher', sessionDate: '2026-10-09' }), true);
  assert.equal(a.canEditAttendance({ ...base, role: 'teacher', sessionDate: '2026-10-08' }), false);
  assert.equal(a.canEditAttendance({ ...base, role: 'admin', sessionDate: '2026-01-01' }), true);
  assert.equal(a.canEditAttendance({ ...base, role: 'admin', sessionDate: '2026-10-11' }), false);
  assert.equal(a.canEditAttendance({ ...base, role: 'finance', sessionDate: '2026-10-10' }), false);
});
test('date helpers', () => { assert.equal(d.daysBetween('2026-02-27', '2026-03-01'), 2); assert.match(d.todayInTz('Africa/Nairobi'), /^\d{4}-\d{2}-\d{2}$/); });
