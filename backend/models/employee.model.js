const db = require("../config/db.config");

const findAll = (filters, callback) => {
    const where = [];
    const values = [];
    const search = String(filters.search || "").trim();

    if (search) {
        where.push("(e.employee_code LIKE ? OR e.employee_name LIKE ? OR e.email LIKE ? OR e.mobile LIKE ?)");
        values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (filters.status) {
        where.push("e.status=?");
        values.push(filters.status);
    }
    if (filters.designation_id) {
        where.push("e.designation_id=?");
        values.push(filters.designation_id);
    }

    const sql = `
        SELECT e.id, e.employee_code, e.employee_name,
               e.designation_id, e.email, e.mobile, e.status, d.designation_name
        FROM employees e
        JOIN designations d
        ON e.designation_id = d.id
        ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
        ORDER BY e.employee_name
    `;

    db.query(sql, values, callback);
};

const findById = (id, callback) => {
    db.query(
        "SELECT id, employee_code, employee_name, designation_id, email, mobile, status FROM employees WHERE id=?",
        [id],
        callback
    );
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO employees
        (id, employee_code, employee_name, designation_id, email, mobile, status)
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
        WHERE id=?
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
        "DELETE FROM employees WHERE id=?",
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
