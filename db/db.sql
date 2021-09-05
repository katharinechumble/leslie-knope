DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;

CREATE TABLE department (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL UNSIGNED NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    INDEX dep_ind (department_id),
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    INDEX role_ind (role_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT UNSIGNED,
    INDEX man_ind (manager_id),
    CONSTRAINT fk_manager FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

use employee_tracker_db;
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
    ('Luna Vea', 'Russak-Pribble-Humble', 8, 7),
    ('Leslie', 'Knope', 7, 1),
    ('Ron', 'Swanson', 3, NULL),
    ('Molly', 'Humble', 2, 1),
    ('Andy', 'Dwyer', 4, 3),
    ('Tom', 'Haverford', 2, 1),
    ('Tammy', 'Swanson', 5, 1),
    ('Donna', 'Meagle', 6, 5);