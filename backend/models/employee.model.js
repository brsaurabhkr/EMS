const db = require("../config/db.config");

const findAll = (callback) => {
    const sql = `
        SELECT e.employee_id AS id, e.employee_code, e.employee_name,
               e.designation_id, e.email, e.mobile, e.status, d.designation_name
        FROM employees e
        JOIN designations d
        ON e.designation_id = d.designation_id
    `;

    db.query(sql, callback);
};

const findById = (id, callback) => {
    db.query(
        "SELECT employee_id AS id, employee_code, employee_name, designation_id, email, mobile, status FROM employees WHERE employee_id=?",
        [id],
        callback
    );
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO employees
        (employee_id, employee_code, employee_name, designation_id, email, mobile, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.id,
            data.employee_code,
            data.employee_name,
            data.designation_id,
            data.email,
            data.mobile,
            data.status,
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE employees
        SET employee_code=?,
            employee_name=?,
            designation_id=?,
            email=?,
            mobile=?,
            status=?
        WHERE employee_id=?
    `;

    db.query(
        sql,
        [
            data.employee_code,
            data.employee_name,
            data.designation_id,
            data.email,
            data.mobile,
            data.status,
            id,
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query(
        "DELETE FROM employees WHERE employee_id=?",
        [id],
        callback
    );
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    delete: remove,
};
