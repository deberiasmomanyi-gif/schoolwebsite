# Privacy and data-protection checklist (Kenya)

This is a practical starting checklist, **not legal advice and not a statement of compliance.** Before using real learner or parent data, have a qualified Kenyan lawyer or the school's data-protection adviser confirm what applies, using the current text of the law and guidance from the Office of the Data Protection Commissioner (ODPC).

## Laws and bodies to review

- [ ] Data Protection Act, 2019 and its Regulations (including the Data Protection (General) Regulations, 2021) - confirm the current versions.
- [ ] Whether the school (or the University of Eldoret on its behalf) must **register with the ODPC** as a data controller and/or processor, and who is legally the controller.
- [ ] The Act's rules on **children's data** - processing a child's personal data needs a lawful basis and appropriate safeguards (confirm how consent from parents/guardians must be obtained and recorded).
- [ ] Rules on **transferring data outside Kenya**: Supabase and Render store data in data centres you choose. Record the region and check whether the transfer is permitted and what safeguards are required.
- [ ] Any Ministry of Education requirements on school records, retention and learner data.

## Before go-live

- [ ] Appoint a person responsible for data protection (and a deputy).
- [ ] Write a **privacy notice** for parents/guardians and staff: what is collected, why, who sees it, how long it is kept, their rights and how to complain.
- [ ] Decide the lawful basis and obtain/record any required consent from parents or guardians.
- [ ] Complete a **data protection impact assessment** (children's data and fee data are higher risk).
- [ ] Sign a data-processing agreement or accept the data-processing terms of Supabase and Render and record that you did.
- [ ] Collect only what is needed: this system deliberately stores no national ID numbers, medical data, religion, ethnicity or photographs. Do not add them without review.
- [ ] Decide who gets which role (least privilege). Review the list of administrators and finance users at least each term.
- [ ] Replace all demo data; confirm no demo logins remain.
- [ ] Set a data retention schedule (e.g. how long archived learners, fee records and logs are kept) and a deletion/anonymisation process.
- [ ] Prepare a procedure for requests from individuals to see, correct or delete their data.
- [ ] Prepare a **breach response plan**: who decides, how to contain it, and the legal deadline for notifying the ODPC and affected people (confirm the current deadline).
- [ ] Agree acceptable-use rules with staff: no sharing passwords, sign out on shared computers, no screenshots of learner data in chat apps, no exports left on personal devices.

## Technical measures already in the code

Hashed passwords, forced password change on temporary passwords, lockout and rate limiting, server-side role checks, learner-link checks for parents/students, CSRF protection, secure headers/CSP, audit log, soft deletion/voiding, no public database access (RLS deny-all).

## Technical measures you must still arrange

HTTPS on the live site, a paid plan with backups, tested restores, an encrypted place for backup files, separate production and test databases, a process for removing staff access when they leave, regular updates of dependencies (`npm audit`, `npm update`), and independent security testing.
