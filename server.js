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
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
},
console.log('Connected to the database')
);