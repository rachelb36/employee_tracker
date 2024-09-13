// Required dependencies
const express = require('express');
const inquirer = require('inquirer');
const consoleTable = require('console.table');
const { Pool } = require('pg'); // Import and require Pool from node-postgres

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const pool = new Pool({
  user: 'postgres',
  password: 'admin', // Update password if needed
  host: 'localhost',
  database: 'employees_db',
});

// Notify when connected to the database
pool.on('connect', () => {
  console.log('Connected to the employees_db database.');
});

// Start the query prompt
mainMenu();

// Function to start Inquirer prompts for user options
async function mainMenu() {
  try {
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: [
          'View All Employees',
          'Add Employee',
          'Update Employee Role',
          'View All Roles',
          'Add Role',
          'View All Departments',
          'Add Department',
          'Quit',
        ],
      },
    ]);

    switch (answer.action) {
      case 'View All Employees':
        await viewEmployees();
        break;
      case 'Add Employee':
        await addEmployee();
        break;
      case 'Update Employee Role':
        await updateRole();
        break;
      case 'View All Roles':
        await viewRoles();
        break;
      case 'Add Role':
        await addRole();
        break;
      case 'View All Departments':
        await showDepartments();
        break;
      case 'Add Department':
        await addDepartment();
        break;
      case 'Quit':
        console.log('Goodbye!');
        pool.end();
        return; // Exit the function and stop the program
    }
  } catch (err) {
    console.error(err);
  }
}

// Function to view all employees
async function viewEmployees() {
  try {
    const sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title AS role, 
               department.department_name AS department, role.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
               FROM employee 
               LEFT JOIN employee manager ON manager.id = employee.manager_id 
               INNER JOIN role ON role.id = employee.role_id 
               INNER JOIN department ON department.id = role.department_id 
               ORDER BY employee.id;`;
    const result = await pool.query(sql); // Await the query result
    console.table(result.rows); // Display results in a table
  } catch (err) {
    console.error('Error fetching employees:', err);
  }
  mainMenu(); // Only restart the menu after completing the action
}

// Function to view all roles
async function viewRoles() {
  try {
    const sql = `SELECT role.id, role.title, role.salary, department.department_name AS department 
               FROM role 
               INNER JOIN department ON department.id = role.department_id;`;
    const result = await pool.query(sql); // Await the query result
    console.table(result.rows); // Display results in a table
  } catch (err) {
    console.error('Error fetching roles:', err);
  }
  mainMenu(); // Only restart the menu after completing the action
}

// Function to view all departments
async function showDepartments() {
  try {
    const sql = `SELECT department.id, department.department_name AS Department FROM department;`;
    const result = await pool.query(sql); // Await the query result
    console.table(result.rows); // Display results in a table
  } catch (err) {
    console.error('Error fetching departments:', err);
  }
  mainMenu(); // Only restart the menu after completing the action
}

// Function to add an employee
async function addEmployee() {
  try {
    const employeesQuery = `SELECT * FROM employee`;
    const rolesQuery = `SELECT * FROM role`;

    const employees = await pool.query(employeesQuery);
    const roles = await pool.query(rolesQuery);

    const employeeList = employees.rows.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const roleList = roles.rows.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'first',
        message: "What is the employee's first name?",
      },
      {
        type: 'input',
        name: 'last',
        message: "What is the employee's last name?",
      },
      {
        type: 'list',
        name: 'role',
        message: "What is the employee's role?",
        choices: roleList, // Use the list of roles for the user to select from
      },
      {
        type: 'list',
        name: 'manager',
        message: "Who is the employee's manager?",
        choices: employeeList, // Use the list of employees for the user to select a manager
      },
    ]);

    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                 VALUES ('${answers.first}', '${answers.last}', ${answers.role}, ${answers.manager});`;

    await pool.query(sql);
    console.log('Employee added successfully.');
  } catch (err) {
    console.error('Error adding employee:', err);
  }
  mainMenu(); // Restart the menu after action
}

// Function to add a department
async function addDepartment() {
  try {
    const answer = await inquirer.prompt([
      {
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?',
      },
    ]);

    const sql = `INSERT INTO department (department_name) VALUES ('${answer.department}');`;
    await pool.query(sql);
    console.log(`Added ${answer.department} to the database`);
  } catch (err) {
    console.error('Error adding department:', err);
  }
  mainMenu(); // Restart the menu after action
}

// Function to update an employee's role
async function updateRole() {
  try {
    const employeesQuery = `SELECT * FROM employee`;
    const rolesQuery = `SELECT * FROM role`;

    const employees = await pool.query(employeesQuery);
    const roles = await pool.query(rolesQuery);

    const employeeList = employees.rows.map((employee) => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));

    const roleList = roles.rows.map((role) => ({
      name: role.title,
      value: role.id,
    }));

    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee',
        message: 'Which employee would you like to update?',
        choices: employeeList,
      },
      {
        type: 'list',
        name: 'role',
        message: "What is the employee's new role?",
        choices: roleList,
      },
    ]);

    const sql = `UPDATE employee SET role_id = ${answers.role} WHERE id = ${answers.employee};`;
    await pool.query(sql);
    console.log('Employee role updated successfully.');
  } catch (err) {
    console.error('Error updating employee role:', err);
  }
  mainMenu(); // Restart the menu after action
}

// Function to add a role
async function addRole() {
  try {
    const sql = `SELECT * FROM department`;
    const departments = await pool.query(sql);

    const departmentList = departments.rows.map((department) => ({
      name: department.department_name,
      value: department.id,
    }));

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: 'What is the name of the role?',
      },
      {
        type: 'input',
        name: 'salary',
        message: 'What is the salary of the role?',
      },
      {
        type: 'list',
        name: 'department',
        message: 'Which department does the role belong to?',
        choices: departmentList,
      },
    ]);

    const sqlInsert = `INSERT INTO role (title, salary, department_id) 
                       VALUES ('${answers.title}', ${answers.salary}, ${answers.department});`;
    await pool.query(sqlInsert);
    console.log(`Added ${answers.title} to the database`);
  } catch (err) {
    console.error('Error adding role:', err);
  }
  mainMenu(); // Restart the menu after action
}

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

// Listen to the PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
