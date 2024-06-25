const inquirer = require('inquirer');
const express = require ('express');
const { Pool } = require('pg');

// Connect to database
const pool = new Pool(
    {
      // Enter PostgreSQL username
      user: 'postgres',
      // Enter PostgreSQL password
      password: 'xUS070es',
      host: 'localhost',
      database: 'employeetracker_db'
  },
  console.log('Connected to the employeeTracker_db database!')
  )
  
  pool.connect();

  // Function to start application
  function start() {
    inquirer
    .prompt({
        type: "list",
        name: "manage",
        message: "What would you like to do?",
        choices: [
            "View all departments",
            "View all roles",
            "View all employees",
            "Add a department",
            "Add a role",
            "Add an employee",
            "Update an employee role",
            "Delete Departments | Roles | Emplployees",
            "View total utilized budget of a department",
        ],
    })
    // Cases for each selection option
    .then((answer) => {
        switch (answer.action) {
            case "View all departments":
                viewAllDepartments();
                break;
            case "View all roles":
                viewAllRoles();
                break;
            case "View all employees":
                viewAllEmployees();
                break;
            case "Add a department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Update an employee role":
                updateEmployeeRole();
                break;
            case "Delete Departments | Roles | Emplployees":
                deleteDepartmentRoleEmployee();
                break;
            case "View the total utilized budegt of a department":
                viewTotalBudget();
                break;
            
        }
    });
  }

  // View all departments function
  function viewAllDepartments() {
    const department = "Select * FROM department";
    connection.department(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        // restart app
        start();
    });
  }

  // View roles function
  function viewAllRoles() {
    const roles = "SELECT roles.title, roles.id, departments.department_name, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id";
    connection.roles(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        // restart app
        start();
    });
  }

  // View employees function
  function viewAllEmployees() {
    const employees = `SELECT e.id, e.first_name, e.last_name, r.title, d.department_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;`;
    connection.employees(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        //restart app
        start();
    });
  }

  // Add department function
  function addDepartment() {
    inquirer
    .prompt({
        type: "input",
        name: "name",
        message: "What is the name of the new department?"
    })
    .then((answer) => {
        console.log(answer.name);
        const newDep = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
        connection.newDep(quer, (err, res) => {
            if (err) throw err;
            console.log(`Added new department ${answer.name} to database!`);
            //restart app
            start();
            console.log(answer.name);
        });
    });
  }

  // Add role function
  function addRole() {
    const addRole = "SELECT * FROM departments";
    connection.addRole(query, (err, res) => {
        if (err) throw err;
        inquirer
        .prompt([
            {
                type: "input",
                name: "title",
                message: "What is the title of the new role?",
            },
            {
                type: "input",
                name: "salary",
                message: "Enter the salary for this new role.",
            },
            {
                type: "list",
                name: "department",
                message: "Select the department for this new role:",
                choices: res.map(
                    (department) => department.department_name
                ),
            },
        ])
        .then((answers) => {
            const department = res.find(
                (department) => department.name === answers.department
            );
            const query = "INSERT INTO roles SET ?";
            connection.query(
                query,
                {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: department,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(`Added role ${answers.title} with salary ${answers.salary} to ${answers.department} department.`);
                    //restart app
                    start();
                }
            );
        });
    });
  }