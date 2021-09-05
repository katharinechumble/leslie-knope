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
    const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, '', manager.last_name) AS manager
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
    const query = `SELECT CONCAT(manager.first_name, '', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title
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
    const addname = await inquirer.prompt(askName());
    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: `What is the new employee's role?`
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query('SELECT * FROM employee', async (err, res) => {
            if (err) throw err;
            let choices = res.map(res => `${res.first_name} ${res.last_name}`);
            choices.push('none');
            let { manager } = await inquirer.prompt([
                {
                    name: 'manager',
                    type: 'list',
                    choices: choices,
                    message: `Choose the new employee's manager:`
                }
            ]);
            let managerId;
            let managerName;
            if (manager === 'none') {
                managerId = null;
            } else {
                for (const data of res) {
                    data.fullName = `${data.first_name} ${data.last_name}`;
                    if (data.fullName === manager) {
                        managerId = data.id;
                        managerName = data.fullName;
                        console.log(managerId);
                        console.log(managerName);
                        continue;
                    }
                }
            }
            console.log('Employee has been added.  Please view all employees to verify!');
            connection.query(
                'INSERT INTO employee SET ?',
                {
                    first_name: addname.first,
                    last_name: addname.last,
                    role_id: roleId,
                    manager_id: parseInt(managerId)
                },
                (err, res) => {
                    if (err) throw err;
                    prompt();
                }
            );
        });
    });
}

// function to verify whether user knows employee's ID

function remove(input) {
    const promptQ = {
        yes: 'Yes.',
        no: 'No. (View All Employees on Main Menu)'
    };
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: `In order to process the employee, please enter the employee's ID.  Do you have the employee's ID? (View All Employees to get)`,
            choices: [promptQ.yes, promptQ.no]
        }
    ]).then(answer => {
        if (input === 'delete' && answer.action === "yes") deleteEmployee();
        else if (input === 'role' && answer.action === 'yes') updateRole();
        else viewAllEmployees();
    });
};

//function to delete an employee

async function deleteEmployee() {
    const answer = await inquirer.prompt([
        {
            name: "first",
            type: "input",
            message: "Please enter the ID of the employee you wish to delete: "
        }
    ]);
    connection.query('DELETE FROM employee WHERE ?', 
    {
        id: answer.first
    },
    function (err) {
        if (err) throw err;
        }
    )
    console.log('Employee has been deleted!');
    prompt();
};

function getId() {
    return ([
        {
            name: "employee id",
            type: "input",
            message: "What is the employee ID?"
        }
    ]);
}

// function to update Employee's role

async function updateRole() {
    const employeeId = await inquirer.prompt(getId());

    connection.query('SELECT role.id, role.title FROM role ORDER BY role.id;', async (err, res) => {
        if (err) throw err;
        const { role } = await inquirer.prompt([
            {
                name: 'role',
                type: 'list',
                choices: () => res.map(res => res.title),
                message: `What is the new employee's role?:`
            }
        ]);
        let roleId;
        for (const row of res) {
            if (row.title === role) {
                roleId = row.id;
                continue;
            }
        }
        connection.query(`UPDATE employee
        SET role_id = ${roleId}
        WHERE employee.id = ${employeeId.name}`, async (err, res) => {
            if (err) throw err;
            console.log(`The employee's role has been successfully updated!`);
            prompt();
        });
    });
}

// function to prompt for the employee's name
function askName() {
    return ([
        {
            name: "first name",
            type: "input",
            message: "Please enter the employee's first name:"
        },
        {
            name: "last name",
            type: "input",
            message: "Please enter the employee's last name:"
        }
    ]);
}