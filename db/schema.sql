-- schema.sql

-- Drop the database if it exists and create a new one
DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

-- Connect to the employees_db database
\c employees_db;

-- Create the department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,               
    department_name VARCHAR(30) UNIQUE NOT NULL  -- Unique department names
);

-- Create the role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,                
    title VARCHAR(30) UNIQUE NOT NULL,    -- Role titles must be unique
    salary DECIMAL NOT NULL,              -- Salary for the role
    department_id INTEGER NOT NULL,       -- Foreign key to department table
    FOREIGN KEY (department_id) REFERENCES department(id) 
);

-- Create the employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,                
    first_name VARCHAR(30) NOT NULL,      -- Employee's first name
    last_name VARCHAR(30) NOT NULL,       -- Employee's last name
    role_id INTEGER NOT NULL REFERENCES role(id),             -- Foreign key to role table
    manager_id INTEGER NULL REFERENCES employee(id) ON DELETE SET NULL  -- Self-referencing foreign key
);
