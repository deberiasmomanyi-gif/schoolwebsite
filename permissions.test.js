const test = require('node:test'); const assert = require('node:assert/strict');
const p = require('../src/config/permissions');
const ROLES = ['super_admin', 'admin', 'teacher', 'finance', 'parent', 'student'];
test('finance officers cannot touch examination results or approve them', () => {
  for (const perm of ['assessments.read', 'assessments.enter', 'assessments.approve', 'assessments.scales', 'results.class']) assert.equal(p.hasPermission('finance', perm), false, perm);
  assert.equal(p.hasPermission('finance', 'fees.manage'), true);
});
test('teachers cannot manage fees, staff or approve results', () => {
  for (const perm of ['fees.manage', 'staff.manage', 'assessments.approve', 'students.write', 'academics.write', 'timetable.write']) assert.equal(p.hasPermission('teacher', perm), false, perm);
  assert.equal(p.hasPermission('teacher', 'attendance.manage'), true);
});
test('parents and students have no staff permissions', () => {
  for (const role of ['parent', 'student']) for (const perm of Object.keys(p.PERMISSIONS)) { if (perm === 'portal.use' || perm === 'announcements.view') continue; assert.equal(p.hasPermission(role, perm), false, role + ' ' + perm); }
  assert.equal(p.hasPermission('parent', 'portal.use'), true);
});
test('only administrators approve results and manage announcements', () => {
  for (const role of ROLES) assert.equal(p.hasPermission(role, 'assessments.approve'), role === 'admin' || role === 'super_admin');
  for (const role of ROLES) assert.equal(p.hasPermission(role, 'announcements.manage'), role === 'admin' || role === 'super_admin');
});
test('unknown permissions are denied', () => { assert.equal(p.hasPermission('super_admin', 'does.not.exist'), false); });
test('nobody can grant a role above their own', () => {
  assert.equal(p.canAssignRole('admin', 'super_admin'), false); assert.equal(p.canAssignRole('admin', 'admin'), false);
  assert.equal(p.canAssignRole('admin', 'teacher'), true); assert.equal(p.canAssignRole('super_admin', 'admin'), true);
  for (const role of ['teacher', 'finance', 'parent', 'student']) for (const t of ROLES) assert.equal(p.canAssignRole(role, t), false);
});
test('admins cannot manage privileged accounts', () => {
  assert.equal(p.canManageAccount('admin', 'admin'), false); assert.equal(p.canManageAccount('admin', 'super_admin'), false);
  assert.equal(p.canManageAccount('admin', 'teacher'), true); assert.equal(p.canManageAccount('super_admin', 'admin'), true);
  assert.equal(p.canManageAccount('teacher', 'student'), false);
});
