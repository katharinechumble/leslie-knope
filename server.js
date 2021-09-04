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
    })
}