'use strict';
// Loads FICTIONAL demonstration data and four demo logins with random one-time passwords.
const fs = require('fs'); const path = require('path');
require('../src/config/env');
const { pool } = require('../src/config/db');
const { hash } = require('../src/services/password');
const { generateTempPassword } = require('../src/services/passwordPolicy');

(async () => {
  const c = await pool.connect();
  try {
    await c.query('BEGIN');
    await c.query(fs.readFileSync(path.join(__dirname, '..', 'database', 'seed-demo.sql'), 'utf8'));
    const out = [];
    async function mk(username, fullName, role) {
      const pw = generateTempPassword();
      const r = await c.query('insert into users (username, full_name, role, password_hash, must_change_password) values ($1,$2,$3,$4,false) returning id', [username, fullName, role, await hash(pw)]);
      out.push([role, username, pw]); return r.rows[0].id;
    }
    const tUser = await mk('demo.teacher', 'Demo Teacher', 'teacher');
    const fUser = await mk('demo.finance', 'Demo Finance Officer', 'finance');
    const pUser = await mk('demo.parent', 'Demo Parent', 'parent');
    const sUser = await mk('demo.student', 'Amani Demo', 'student');
    const tStaff = (await c.query("insert into staff (user_id, staff_number, job_title) values ($1,'DEMO-T1','Teacher (demo)') returning id", [tUser])).rows[0].id;
    await c.query("insert into staff (user_id, staff_number, job_title) values ($1,'DEMO-F1','Finance officer (demo)')", [fUser]);
    await c.query("update classes set class_teacher_id = $1 where name = '7A'", [tStaff]);
    await c.query(`insert into teaching_assignments (staff_id, class_id, subject_id)
      select $1::uuid, c.id, s.id from classes c, subjects s where c.name in ('7A','7B') and s.code in ('MATH','ENG')`, [tStaff]);
    const g = (await c.query("insert into guardians (user_id, full_name, phone) values ($1,'Demo Parent','0700000000') returning id", [pUser])).rows[0].id;
    await c.query("insert into guardian_students (guardian_id, student_id, relationship, is_primary) select $1::uuid, id, 'Parent', true from students where admission_no in ('DEMO-0001','DEMO-0002')", [g]);
    await c.query("update students set user_id = $1 where admission_no = 'DEMO-0001'", [sUser]);
    await c.query(`insert into timetable_slots (class_id, academic_year_id, day_of_week, period, subject_id, staff_id, room)
      select c.id, c.academic_year_id, d.day, d.p, s.id, $1::uuid, 'Room 1' from classes c, subjects s,
      (values (1,1,'MATH'),(1,2,'ENG'),(2,1,'ENG'),(2,3,'MATH'),(3,2,'MATH'),(4,1,'ENG'),(5,4,'MATH')) as d(day,p,code)
      where c.name = '7A' and s.code = d.code`, [tStaff]);
    await c.query('COMMIT');
    console.log('\nDemo data loaded. Demo logins (shown ONCE - write them down; delete the demo data before real use):\n');
    for (const [role, u, p] of out) console.log(`  ${role.padEnd(8)} username: ${u.padEnd(14)} password: ${p}`);
    console.log('\nThe parent can see DEMO-0001 and DEMO-0002; the student account is DEMO-0001.');
  } catch (e) { try { await c.query('ROLLBACK'); } catch (_) { /* ignore */ } console.error('\n[SEED FAILED] ' + e.message); process.exitCode = 1; } finally { c.release(); await pool.end(); }
})();
