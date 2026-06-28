# PEMRM1 Division Avg Dashboard

Dashboard combines Absenteeism and OT data for MF, ME, UM, UE, SE.
It shows department rows plus Division Avg / Total row for each parameter.

Calculation:
- % parameters and Hrs/Person = average of available department values
- Total leaves, associates, OT hours and count parameters = sum of departments
- Remarks = combined text from all departments

Keep your existing correct firebase-config.js or paste fresh Firebase Web App config.


## Pending Report Page
Open pending-report.html to see department-wise pending parameters up to the current month.
It shows missing Absenteeism & OT parameters by department and last available remarks/comment.
It also shows common KPI pending parameters up to the current month.
