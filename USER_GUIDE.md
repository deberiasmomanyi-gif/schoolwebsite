# User guide

## Signing in and passwords

* Go to the portal address and click **Sign in**.
* New accounts get a temporary password from the school office; you must choose your own on first sign-in (at least 10 characters with upper case, lower case and a number).
* Forgot your password? Ask the school office. An administrator issues a new temporary password (there is no e-mail reset in this version).
* After 5 wrong passwords an account is locked for 15 minutes.
* Always click **Sign out** on shared computers.

## Super administrator and school administrator

* **Dashboard:** counts and charts come live from the database. Use the filters (year, term, grade, class) and **Apply filters**.
* **Students:** *Register student*, click a row to open a profile: edit, transfer class, change status (archive instead of delete), add guardians, create student/parent logins, reset passwords. *Export CSV* downloads the current list.
* **Teachers and staff:** add staff, set roles, deactivate leavers, reset passwords. Only a super administrator can create or change administrators.
* **Classes and subjects:** academic years and terms, classes (with class teacher), subjects, and which teacher teaches which subject in which class.
* **Attendance:** take or correct any register; reports by class and term or date range, CSV download.
* **Assessments:** review submitted assessments and **Approve** (locks the marks) or **Reopen** with a reason. Manage grading scales.
* **Results:** class performance table and report cards (approved results only).
* **Fees:** administrators can also manage fees (same as finance).
* **Timetable:** click a cell to set subject, teacher and room. Clashes are refused.
* **Announcements:** write a draft, choose the category and audience, **Publish**. Tick *Public website* to show it on the homepage. Archive when it is no longer relevant.

## Teacher

* **Dashboard:** your classes, subjects and whether today's registers are taken.
* **Attendance > Daily register:** choose class and date, change anyone who is not present, **Save register**. You can edit a register until the end of the next day (setting `ATTENDANCE_EDIT_WINDOW_DAYS`); after that ask an administrator.
* **Assessments:** *New assessment* (only for classes and subjects assigned to you), type marks (cannot exceed the maximum), tick *Absent* if the learner missed it, **Save marks**, then **Save and submit for approval**. After submission you cannot change marks.
* **Results:** class results for classes you teach; report cards.
* **Timetable:** *My timetable* and class timetables.

## Finance officer

* **Fees > Accounts and balances:** search a learner, **Record payment** (amount, date, method, reference), **Statement** to see charges and payments, **Add charges** for a learner, class or grade. A receipt opens ready to print.
* Mistakes: **Void** with a reason (nothing is deleted; the audit trail keeps who did it).
* **Summary:** totals and chart by class. Export balances or payments to CSV.
* This module records money received; it does not collect M-Pesa or bank payments. An M-Pesa payment is recorded as "M-Pesa (recorded manually)" with the transaction code as reference.
* Finance officers cannot see or change examination results.

## Parent or guardian

* **My children:** choose a child (if you have more than one). Tabs: **Results** (term report, only approved results), **Attendance**, **Timetable**, **Fees** (statement and receipts) and **Announcements**.
* You can only see children linked to your account. Ask the school office if a child is missing.
* **My account:** change your password.

## Student

Same as the parent view for your own records. Fee statements are hidden unless the school switches them on (`STUDENT_CAN_VIEW_FEES=true`).

## Printing and PDFs

Report cards, receipts and statements open on a clean page. Click **Print or save as PDF** and choose *Save as PDF* as the printer.

## How grades and percentages are worked out

* Percentage = score / maximum marks x 100, rounded to 2 decimal places.
* Subject average = total score / total maximum across approved assessments in the term.
* A learner marked absent for an assessment is left out of that average (not counted as zero).
* The grade is the band with the highest "From %" that the learner reaches in the active grading scale.
* Class position: highest overall % is position 1; equal percentages share a position.
* Attendance % = (present + late) / (present + late + absent). Excused days are not counted.
* Fee balance = charges - payments, ignoring voided entries. A negative balance means the family has paid in advance.
