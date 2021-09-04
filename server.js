//requiring dependencies
const mysql = require('mysql2');
const inquirer = require('inquirer');
const console = require('console.table');

// prompt messages
const promptMessage = {
    viewAllEmployees: "View All Employees",
    viewByDepartment: "View Employees By Department",
    viewByManager: "View Employees By Manager",
    addEmployee: "Add An Employee",
    removeEmployee: "Remove An Employee",
    updateRole: "Update Employee's Role",
    updateEmployeeManager: "Update Employee's Manager",
    viewAllRoles: "View All Roles",
    exit: "Exit"
};

//connect to the databse
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3001,
    //login credentials, using dotenv to secure password
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
},
console.log('Connected to the database')
);

connection.connect(err => {
    if (err) throw err;
    userMenu();
});

// use inquirer to give users menu options

function userMenu() {
    inquirer.prompt({
        name: 'menu',
        type: 'list',
        message: 'What would you like to do?',
        choices: [
            promptMessages.viewAllEmployees,
            promptMessages.viewByDepartment,
            promptMessages.viewByManager,
            promptMessages.viewAllRoles,
            promptMessages.addEmployee,
            promptMessages.removeEmployee,
            promptMessages.updateRole,
            promptMessages.exit
        ]
    }).then(answer => {
        console.log('answer', answer);
        switch (answer.action){
            case promptMessages.viewAllEmployees:
                viewAllEmployees();
                break;
            case promptMessages.viewByDepartment:
                viewByDepartment();
                break;
            case promptMessages.viewByManager:
                viewByManager();
                break;
            case promptMessages.viewAllRoles:
                viewAllRoles();
                break;
            case promptMessages.addEmployee:
                addEmployee();
                break;
            case promptMessages.removeEmployee:
                remove('delete');
                break;
            case promptMessages.updateRole:
                updateRole();
                break;
        }
    });
}

// functions to view, filter, and sort employees

function viewAllEmployees() {
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN employee manager ON (manager.id = employee.manager_id)
    INNER JOIN role ON (role.id = employee.role_id)
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY employee.id;`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log('\n');
        console.log('VIEW ALL EMPLOYEES');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

function viewByDepartment(){
    const query = `SELECT department.name AS department, role.title, employee.id, employee.first_name, employee.last_name
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY department.name;`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY DEPARTMENT');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

function viewByManager() {
    const query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
    FROM employee
    LEFT JOIN employee manager ON (manager.id = employee.manager_id)
    INNER JOIN role ON (role.id = employee.role_id && employee.manager_id !='NULL')
    INNER JOIN department ON (department.id = role.department_id)
    ORDER BY manager;`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY MANAGER');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

function viewAllRoles() {
    const query = `SELECT role.title, employee.id, employee.first_name, employee.last_name, department.name AS department
    FROM employee
    LEFT JOIN role ON (role.id = employee.role_id)
    LEFT JOIN department ON (department.id = role.department_id)
    ORDER BY role.title;`;
    connection.query(query, (err, res) => {
        if(err) throw err;
        console.log('\n');
        console.log('VIEW EMPLOYEE BY ROLE');
        console.log('\n');
        console.table(res);
        prompt();
    });
}

// add functions to add, remove, and edit employees

async function addEmployee() {

}