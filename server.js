const inquirer = require('inquirer');
const express = require('express');
const { Pool } = require('pg');

// Connect to database
const pool = new Pool(
    {
        host: "localhost",
        // Enter PostgreSQL username
        user: 'postgres',
        // Enter PostgreSQL password
        password: 'xUS070es',
        host: 'localhost',
        database: 'employeetracker_db'
    });

pool.connect((err) => {
    if (err) throw (err)
    console.log('Connected to the employeeTracker_db database!');
    start();
});

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
            console.log(answer);
            switch (answer.manage) {
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
                case "View total utilized budget of a department":
                    viewTotalBudget();
                    break;

            }
        });
}

// View all departments function
function viewAllDepartments() {
    console.log("view departments");
    const sql = "Select * FROM departments";
    pool.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        //console.log(res);
        // restart app
        start();
    });
}

// View roles function
function viewAllRoles() {
    const sql = "SELECT roles.title, roles.id, departments.title, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id";
    pool.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        // restart app
        start();
    });
}

// View employees function
function viewAllEmployees() {
    const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.title, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON e.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;`;
    pool.query(sql, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
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
            const sql = `INSERT INTO departments (title) VALUES ($1)`;
            const params = [answer.name];
            pool.query(sql, params, (err, res) => {
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
    const sql = "SELECT * FROM departments";
    let departments;
    pool.query(sql, (err, res) => {
        if (err) throw err;
 departments = res.rows.map(
    (department) => {
        { name: department.title, value: department.id}
    }
);
console.log(departments);
    })
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
                    choices: departments,
                },
            ])
            .then((answers) => {
                console.log(answers);
                // const department = res.find(
                //     (department) => department.name === answers.department
                // );
                // const query = "INSERT INTO roles SET ?";
                // connection.query(
                //     query,
                //     {
                //         title: answers.title,
                //         salary: answers.salary,
                //         department_id: department,
                //     },
                //     (err, res) => {
                //         if (err) throw err;
                //         console.log(`Added role ${answers.title} with salary ${answers.salary} to ${answers.department} department.`);
                //         //restart app
                //         start();
                //     }
                // );
            });
    // });
}

// Add employee function
function addEmployee() {
    pool.query("SELECT id, title FROM roles", (error, results) => {
        if (error) {
            console.log(error);
            return;
        }
        const roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));
        // obtain employee list from database
        pool.query(
            `SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee`,
            (error, results => {
                if (error) {
                    console.error(error);
                    return;
                }
                const managers = results.map(({ id, name }) => ({
                    name,
                    value: id,
                }));
                inquirer
                    .prompt([
                        {
                            type: "name",
                            name: "firstName",
                            message: "What is the employee's first name?",
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "What is the employee's last name?",
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Select the correct employee role:",
                            choices: roles,
                        },
                        {
                            type: "list",
                            name: "managerId",
                            message: "Choose the employee manager",
                            choices: [
                                { name: "None", value: null },
                                ...managers,
                            ],
                        },
                    ])
                    .then((answers) => {
                        const sql = "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                        const values = [
                            answers.firstname,
                            answers.lastname,
                            answers.roleId,
                            answers.managerId,
                        ];
                        pool.query(sql, values, (error) => {
                            if (error) {
                                console.error(error);
                                return;
                            }
                            console.log("Employee has been added!")
                            start();
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    })
            })
        )
    });
}

// Update employee role function
function updateEmplRole() {
    const sql =
        "Select employee.id, employee.first_name, employee.last_name, roles.title FROM employee employee LEFT JOIN roles ON employee.role_id = roless.id";
    const roles = "SELECT * FROM roles";
    pool.query(sql, (err, resEmployees) => {
        if (err) throw err;
        pool.query(roles, (err, resRoles) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Select an employee to update:",
                        choices: resEmployees.map(
                            (employees) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select a new role fir this employee:",
                        choices: resRoles.map((role) => role.title),
                    },
                ])
                .then((answers) => {
                    const employee = resEmployee.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` === asnswer.employee
                    );
                    const role = resRoles.find(
                        (role) => role.title === answers.role
                    );
                    const sql = "UPDATE employee SET role_id = ? WHERE id = ?";
                    pool.query(
                        sql,
                        [role.id, employee.id],
                        (err, res) => {
                            if (err) throw err;
                            console.log(`Updated ${employee.first_name} ${employee.last_name}'s role to ${role.title}!`);
                            start();
                        }
                    );
                });
        });
    });
}

// Delete employee function
function deleteEmployee() {
    const sql = "SELECT * FROM employee";
    pool.query(sql, (err, res) => {
        if (err) throw err;
        const employeeList = res.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        employeeList.push({ name: "cancel", value: "back" }); //add "cancel" option
        inquirer
            .prompt({
                type: "list",
                name: "employee",
                message: "Which employee do you want to delete?",
                choices: employeeList,
            })
            .then((answer) => {
                if (answer.id === "cancel") {
                    deleteDepartmentRolesEmployees();
                    return;
                }
                const sql = "DELETE FROM employee WHERE id = ?";
                pool.query(sql, [answer.id], (err, res) => {
                    if (err) throw err;
                    console.log(`Successfully deleted employee id ${answer.id}.`);
                    start();
                });
            });
    });
}

// Delete Role function
function deleteRole() {
    // retrieve all available roles from the database
    const sql = "SELECT * FROM roles";
    pool.query(sql, (err, res) => {
        if (err) throw err;
        const choices = res.map((role) => ({
            name: `${role.title} (${role.id}) - ${role.salary}`,
            value: role.id,
        }));
        // add a "Go Back" option to the list of choices
        choices.push({ name: "Go Back", value: null });
        inquirer
            .prompt({
                type: "list",
                name: "roleId",
                message: "Select the role you want to delete:",
                choices: choices,
            })
            .then((answer) => {
                // check if the user chose the "Go Back" option
                if (answer.roleId === null) {
                    // go back to the deleteDepartmentsRolesEmployees function
                    deleteDepartmentsRolesEmployees();
                    return;
                }
                const sql = "DELETE FROM roles WHERE id = ?";
                pool.query(sql, [answer.roleId], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Successfully deleted role ${answer.roleId} from the database!`
                    );
                    start();
                });
            });
    });
}

// Delete department function
function deleteDep() {
    // retrieve list of departments
    const sql = "SELECT * FROM departments";
    pool.query(sql, (err, red) => {
        if (err) throw err;
        const depChoices = res.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));
        //prompt to select department
        inquirer
            .prompt({
                type: "list",
                name: "department",
                message: "Select a department to delete:",
                choices: [
                    ...depChoices,
                    { name: "Cancel", value: "back" },
                ],
            })
            .then((answer) => {
                if (answer.department === "back") {
                    deleteDepartmentRolesEmployees();
                } else {
                    const sql = "DELETE FROM departments WHERE id = ?";
                    pool.query(
                        sql,
                        [answer.department],
                        (err, res) => {
                            if (err) throw err;
                            console.log(`Deleted department ID ${answer.department} from database.`);
                            start();
                        }
                    );
                }
            });
    });

}

// View total budget function
function viewTotalBudget() {
    const sql = "SELECT * FROM departments";
    pool.sql(query, (err, res) => {
        if (err) throw err;
        const depChoices = res.map((department) => ({
            name: department.title,
            value: department.id,
        }));

        //prompt to select department
        inquirer
            .prompt({
                type: "list",
                name: "departmentID",
                message: "Select a department to get the total salary for.",
                choices: depChoices,
            })
            .then((answer) => {
                //calculate total salary
                const query =
                    `SELECT departments.title AS department,
                     SUM(roles.salary) AS total_salary
                     FROM departments
                     INNER JOIN roles ON departments.id = roles.department_id
                     INNER JOIN employee ON roles.id = employee.role_id
                     WHERE
                     departments.id = ?
                     GROUP BY departments.id;`;
                pool.query, (answer.departmentID), (err, res) => {
                    if (err) throw err;
                    const salaryTotal = res[0].salary_total;
                    console.log(`The calculated total employee salary is ${salaryTotal}`);
                };
                start();
            });
    });
}