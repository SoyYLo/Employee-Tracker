-- Department values --
INSERT INTO departments (title)
VALUES 
('Marketing'),
('Human Resources'),
('Accounting'),
('Reception'),
('Sales'),
('Quality Assurance'),
('Customer Relations'),
('Service');

-- Roles values --
INSERT INTO roles (title, salary, department_id)
VALUES
('Manager', 95000, 1),
('HR Supervisor', 87000, 2),
('Accounting Director', 90000, 3),
('Senior Receptionist', 70000, 4),
('Sales Manager', 75000, 5),
('Quality Assurance Director', 80000, 6),
('Customer Relations Coordinator', 70000, 7),
('Customer Service Manager',76000, 8 );

-- Employee values --
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
('Michael', 'Scott',1, 1),
('Toby', 'Flenderson', 2, 2),
('Angela', 'Martin', 3, 3),
('Pam', 'Beasley', 4, 4),
('Dwight', 'Schrute', 5, 5),
('Creed', 'Bratton', 6, 6),
('Meredith', 'Palmer', 7, 7),
('Kelly', 'Kapor', 8, 8);