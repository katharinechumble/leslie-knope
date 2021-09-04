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
    ('Business Office'),
    ('Service');
INSERT INTO role
    (title, salary, department_id)