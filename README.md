# SQL Challenge: Employee Tracker

## Description

- This application uses a built a command-line application from scratch to manage a company's employee database, using Node.js, Inquirer, and PostgreSQL.

## Tasks Completed

-- Created a remote repository and connected it to local machine

-- Created the database connection using PostgresSQL

-- Created the db/schema.sql file and the db/seeds.sql

-- Created CRUD routes for the employee, role, department tables

-- Added npm dependencies, console.table, to display data in table format and figlet.cli for application's opening header.

## Installation

- clone the repo

- seed the database by running `psql -U postgres', `\i db/schema.sql`and then`\i db/seeds.sql`.  Once database is seeded run `\q' to quit postgresSQL

- install npm using `npm i` in terminal

- Start application using `npm start` in terminal

## Usage

![EMPLOYEE TRACKER](/assets/images/employee_tracker.png)

- <https://www.youtube.com/watch?v=mJUvF7wCtEU>

## Credits

\*\* This project was accomplished with the help provided by the instructors and TAs of the Rice University Coding Bootcamp, including Instructor Darian Mendez, Mateo Wallace, Mark Alfano, Gerard Mennella

References:

- <https://www.npmjs.com/package/console.table>

- <https://www.npmjs.com/package/inquirer/v/8.2.4>

  ## License

- LicenseDistributed under the MIT License. See LICENSE.txt for more information.
