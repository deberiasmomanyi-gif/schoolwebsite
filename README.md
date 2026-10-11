# Testing

## 1. Automated tests (no database needed)

```
npm test
```

Covers: grade and percentage calculation, score validation, grading-scale validation, ranking with ties, attendance percentage and edit-window rules, fee balances and statements, timetable clash detection, CSV escaping and formula-injection protection, password policy and generated passwords, and the **permission matrix** (finance cannot touch results, teachers cannot manage fees/staff or approve results, parents/students have no staff permissions, nobody can grant a role above their own).

```
npm run check
```

Static checks: required files exist, every HTML page's CSS/JS/links exist, no inline event handlers (blocked by the security policy), every JavaScript file parses, and every `/api/...` call made by the browser code matches a route in the server.

## 2. What the automated tests do NOT cover

The server routes, SQL queries, database triggers and the browser screens were **not executed** during development (no database or browser was available). Test them yourself with the manual checklist below on a **test** database with demo data (`npm run seed-demo`). If something fails, note the exact steps and the red error from the terminal (`[ERROR] ...`).

## 3. Manual test checklist

Tick each line. Use two browsers (or one normal and one private window) to test two roles at once.

### Setup
- [ ] `npm run setup-db` finishes with "Database is ready".
- [ ] `npm run create-admin` creates the administrator. `npm start` shows "Database connection: OK".
- [ ] http://localhost:3000 shows the homepage; **Sign in** opens the login page.

### Authentication
- [ ] Wrong password shows an error; 5 wrong passwords lock the account for 15 minutes.
- [ ] Correct login goes to the dashboard. **Sign out** returns to login and the Back button does not show data.
- [ ] A new staff account is forced to change its temporary password before anything else.
- [ ] Password change rejects weak passwords; the old password stops working.

### Administrator
- [ ] Dashboard figures match what you see in Students/Classes/Fees (change a number, reload, confirm it changes).
- [ ] Create year, terms (one current), classes for Grades 7-9, subjects, staff, assignments.
- [ ] Register a student (admission number auto-generated); edit; transfer class; set status; archive (disappears from default list, appears under "Archived only").
- [ ] Add a guardian with a login; copy the password; reset it; unlink.
- [ ] Students CSV downloads and opens in Excel with correct text.

### Teacher (use `demo.teacher` or your own)
- [ ] Sees only assigned classes in Attendance/Assessments/Results/Students.
- [ ] Take a register; save twice (no duplicates); change one learner; reload and confirm.
- [ ] Try a date 3+ days ago: locked for the teacher, editable by an administrator.
- [ ] Create an assessment; enter a score above the maximum: rejected. Enter valid marks; submit.
- [ ] After submitting the teacher cannot change marks. Administrator approves; then nobody can change marks until reopened (with a reason).

### Finance
- [ ] Add a charge to a class; record a payment; receipt opens; balance updates.
- [ ] Void a payment with a reason; balance returns; the audit trail on the dashboard shows it.
- [ ] Finance user cannot open Assessments/Results/Students pages (redirected) and the API returns 403 (see below).

### Parent and student
- [ ] Parent sees only linked children; results show only approved assessments.
- [ ] Attendance, timetable, fees and announcements tabs load. Printing a report card and a receipt works.
- [ ] Student sees only their own records; fees hidden unless `STUDENT_CAN_VIEW_FEES=true`.

### Authorization attacks (the most important tests)
With the parent signed in, open the browser developer tools (F12) > Console and run (replace the id with a learner who is NOT linked to this parent):
```js
fetch('/api/portal/children/PUT-ANOTHER-LEARNER-ID-HERE/report-card?termId=ANY').then(r => r.status)
```
- [ ] Must return **403**. Also try `/api/students`, `/api/fees/accounts`, `/api/staff` as parent/student/teacher: must return **403**.
- [ ] As a teacher, try to open an assessment of a class you are not assigned to: **403**.
- [ ] A POST without the CSRF header fails with 403.

### Timetable, announcements
- [ ] Putting the same teacher or room in two classes at the same period is refused.
- [ ] Publish a notice to *Parents*: parent sees it and gets a notification; teacher does not. A notice marked *Public website* appears on the homepage; expired/archived ones disappear.

### Reporting
- [ ] Attendance report percentages match a hand calculation for one learner.
- [ ] Report card totals and class position match a hand calculation.
