--drops any prexisting database--
DROP DATABASE IF EXISTS employee-tracker-db;
--creates database--
CREATE DATABASE employee-tracker-db;
--commands app to use the selected database--
USE employee-tracker-db;

-- create department table --
CREATE TABLE department (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Create roles table --
CREATE TABLE role (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL UNSIGNED NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    INDEX dep_ind (department_id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

--create employee table--
CREATE TABLE employee (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    roll_id INT UNSIGNED NOT NULL,
    INDEX role_ind (role_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCE employee(id) ON DELETE SET NULL
);

--Add values--
use employee-tracker-db;
INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Operations'),
    ('Purchasing'),
    ('Business Office');
INSERT INTO role
    (title, salary, department_id)
VALUES
    ('General Manager', 150000, 1),
    ('Sales Associate', 45000, 1),
    ('Operations Manager', 125000, 2),
    ('Service Technician', 65000, 2),
    ('Purchasing Manager', 125000, 3),
    ('Buyer', 95000, 3),
    ('Business Office Manager', 125000, 4),
    ('Business Office Associate', 30000, 4);
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Xena', 'Russak-Pribble-Humble', 1, NULL),
    ('Findekano', 'Humble', 2, 1),
    ('Luna Vea', 'Russak-Pribble-Humble', 8, 7)
    ('Leslie', 'Knope', 7, 1),
    ('Ron', 'Swanson', 3, NULL),
    ('Molly', 'Humble', 2, 1),
    ('Andy', 'Dwyer', 4, 3),
    ('Tom', 'Haverford', 2, 1),
    ('Tammy', 'Swanson', 5, 1),
    ('Donna', 'Meagle', 6, 5);