const db = require("../config/db.config");

const findAll = (callback) => {
    const sql = `
        SELECT t.task_id AS id, t.task_id, t.task_code, t.title, t.description,
               t.employee_id, t.priority, t.due_date, t.status, e.employee_name
        FROM tasks t
        JOIN employees e
        ON t.employee_id = e.employee_id
    `;

    db.query(sql, callback);
};

const findById = (id, callback) => {
    db.query(
        "SELECT task_id AS id, task_code, title, description, employee_id, priority, due_date, status FROM tasks WHERE task_id=?",
        [id],
        callback
    );
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO tasks
        (task_id, task_code, title, description, employee_id, priority, due_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            data.task_id,
            data.task_code,
            data.title,
            data.description,
            data.employee_id,
            data.priority,
            data.due_date,
            data.status,
        ],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE tasks
        SET task_id=?,
            task_code=?,
            title=?,
            description=?,
            employee_id=?,
            priority=?,
            due_date=?,
            status=?
        WHERE task_id=?
    `;

    db.query(
        sql,
        [
            data.task_id,
            data.task_code,
            data.title,
            data.description,
            data.employee_id,
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
        "DELETE FROM tasks WHERE task_id=?",
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
