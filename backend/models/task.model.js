const db = require("../config/db.config");

const findAll = (filters, callback) => {
    const where = [];
    const values = [];
    const search = String(filters.search || "").trim();

    if (search) {
        where.push("(t.task_code LIKE ? OR t.title LIKE ? OR e.employee_name LIKE ?)");
        values.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (filters.status) {
        where.push("t.status=?");
        values.push(filters.status);
    }
    if (filters.priority) {
        where.push("t.priority=?");
        values.push(filters.priority);
    }
    if (filters.employee_id) {
        where.push("t.employee_id=?");
        values.push(filters.employee_id);
    }
    if (filters.designation_id) {
        where.push("t.designation_id=?");
        values.push(filters.designation_id);
    }

    const sql = `
        SELECT t.id, t.task_code, t.title, NULL AS description,
               t.employee_id, t.priority, DATE_FORMAT(t.due_date, '%Y-%m-%d') AS due_date,
               t.status, e.employee_name
        FROM tasks t
        JOIN employees e
        ON t.employee_id = e.id
        ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
        ORDER BY t.due_date ASC
    `;

    db.query(sql, values, callback);
};

const findById = (id, callback) => {
    db.query(
        "SELECT id, task_code, title, NULL AS description, employee_id, priority, DATE_FORMAT(due_date, '%Y-%m-%d') AS due_date, status FROM tasks WHERE id=?",
        [id],
        callback
    );
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO tasks
        (id, task_code, title, employee_id, designation_id, priority, due_date, status)
        SELECT ?, ?, ?, e.id, e.designation_id, ?, ?, ?
        FROM employees e
        WHERE e.id=?
    `;

    db.query(
        sql,
        [
            data.id,
            data.task_code,
            data.title,
            data.priority,
            data.due_date,
            data.status,
            data.employee_id,
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE tasks t
        JOIN employees e ON e.id=?
        SET t.task_code=?,
            t.title=?,
            t.employee_id=e.id,
            t.designation_id=e.designation_id,
            t.priority=?,
            t.due_date=?,
            t.status=?
        WHERE t.id=?
    `;

    db.query(
        sql,
        [
            data.employee_id,
            data.task_code,
            data.title,
            data.priority,
            data.due_date,
            data.status,
            id,
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query(
        "DELETE FROM tasks WHERE id=?",
        [id],
        callback
    );
};

const updateStatus = (id, status, callback) => {
    db.query(
        "UPDATE tasks SET status=? WHERE id=?",
        [status, id],
        callback
    );
};

module.exports = {
    findAll,
    findById,
    create,
    update,
    updateStatus,
    delete: remove,
};
