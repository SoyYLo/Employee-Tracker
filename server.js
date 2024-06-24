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
      database: 'employeeTracker_db'
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