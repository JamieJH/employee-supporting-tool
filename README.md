# Employee Supporting App

### DESCRIPTION
- A ReactJS app to support employees regarding their working calendar, absent request and salary.

### REQUIREMENTS:
-	Use ReactJS
-	Manage state, props
-	Apply lifecycle
-	Organize suitable structure folder
-	There is a Launch view and Login page so that the employee can see at first.
-	Store data (using **Firebase**), not on the browser side
-	Authentication and Authorization (using **Firebase**)
-	Working with form, calendar (**upgrades**: react-final-form, react-calendar)
-	Responsive for all devices and browsers.
#### Requirement for the user (employee):
- View the working calendar in full month (see all information related: absent day, bonus day, …)
- Request for an absent day
- Log OT
- Salary statistic: check for each month, can view the progress
#### Requirement for admins (admin, superadmin):
- Review/Check/Edit all employees' calendar and salary formula.	
- Create/Edit/Approve/Decline absent request, OT logs – both
- Change some settings, formula – superadmin
- Add new member(create new account)

## Completed Features

#### Employee
- View the working calendar including approved absence days and OT logs.
- View Salary History by year, current month progress (gross, OT log pay so far) and absence days taken this year.
- View all their submitted OT logs and submit a new one.
- View all their requested absence days and submit a new one.
- View how salary is calculated.
- Each Employee is assigned an Admin (team leader), all requests are processed by this Admin.

#### Admin
- Includes all Employee features and:
- View, Add, and Edit user details of team members.
- View, Add, Edit, and Process OT logs and absence days of team members.


#### Superadmin
- Include all Employee and Admin features and:
- Edit Salary Formula for each type of employee (Fresher, Probation, and Official).
- Calculate and Confirm monthly payout for employees.