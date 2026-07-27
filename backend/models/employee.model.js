const db = require("../config/db.config");

// Create Employee
const createEmployee = (employee, callback) => {
    const sql = `
        INSERT INTO employee
        (id, employee_code, employee_name, designation_id, email, mobile, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            employee.id,
            employee.employee_code,
            employee.employee_name,
            employee.designation_id,
            employee.email,
            employee.mobile,
            employee.status,
        ],
        callback
    );
};

 
const getAllEmployees = (callback) => {
    const sql = `
        SELECT
            e.id,
            e.employee_code,
            e.employee_name,
            e.designation_id,
            d.designation_name AS designation,
            e.email,
            e.mobile,
            e.status
        FROM employee e
        LEFT JOIN designations d ON e.designation_id = d.id
    `;
    db.query(sql, callback);
};

// Update Employee
const updateEmployee = (id, employee, callback) => {
    const sql = `
        UPDATE employee
        SET employee_code = ?,
            employee_name = ?,
            designation_id = ?,
            email = ?,
            mobile = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            employee.employee_code,
            employee.employee_name,
            employee.designation_id,
            employee.email,
            employee.mobile,
            employee.status,
            id,
        ],
        callback
    );
};

// Delete Employee
const deleteEmployee = (id, callback) => {
    const sql = "DELETE FROM employee WHERE id = ?";
    db.query(sql, [id], callback);
};

module.exports = {
    createEmployee,
    getAllEmployees,
    updateEmployee,
    deleteEmployee,
};
