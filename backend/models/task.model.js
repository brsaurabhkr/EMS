const db = require("../config/db.config");

// Create Task
const createTasks = (task, callback) => {
    const sql = `
        INSERT INTO tasks
        (task_id, task_code, title, description, employee_id, priority, due_date, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            task.task_id,
            task.task_code,
            task.title,
            task.description,
            task.employee_id,
            task.priority,
            task.due_date,
            task.status,
        ],
        (err, results) => {
            if (err && err.code === 'ER_BAD_FIELD_ERROR') {
                // retry without task_id column if DB doesn't have it
                const sql2 = `
                    INSERT INTO tasks
                    (task_code, title, description, employee_id, priority, due_date, status)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;
                return db.query(
                    sql2,
                    [
                        task.task_code,
                        task.title,
                        task.description,
                        task.employee_id,
                        task.priority,
                        task.due_date,
                        task.status,
                    ],
                    callback
                );
            }
            callback(err, results);
        }
    );
};

const getTaskByCode = (task_code, callback) => {
    const sql = `SELECT id FROM tasks WHERE task_code = ?`;
    db.query(sql, [task_code], callback);
};

const getTaskByTaskId = (task_id, callback) => {
    const sql = `SELECT id FROM tasks WHERE task_id = ?`;
    db.query(sql, [task_id], (err, results) => {
        if (err && err.code === 'ER_BAD_FIELD_ERROR') {
            // task_id column missing — treat as no results (no conflict)
            return callback(null, []);
        }
        callback(err, results);
    });
};

const getTaskByCodeExceptId = (task_code, id, callback) => {
    const sql = `SELECT id FROM tasks WHERE task_code = ? AND id != ?`;
    db.query(sql, [task_code, id], callback);
};

const getTaskByTaskIdExceptId = (task_id, id, callback) => {
    const sql = `SELECT id FROM tasks WHERE task_id = ? AND id != ?`;
    db.query(sql, [task_id, id], (err, results) => {
        if (err && err.code === 'ER_BAD_FIELD_ERROR') {
            return callback(null, []);
        }
        callback(err, results);
    });
};

// Get All Tasks
const getAllTasks = (callback) => {
    const sql = `
        SELECT
            id,
            task_id,
            task_code,
            title,
            description,
            employee_id,
            priority,
            due_date,
            status
        FROM tasks
    `;

    db.query(sql, callback);
};

// Update Task
const updateTask = (id, task, callback) => {
    const sql = `
        UPDATE tasks
        SET
            task_id = ?,
            task_code = ?,
            title = ?,
            description = ?,
            employee_id = ?,
            priority = ?,
            due_date = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            task.task_id,
            task.task_code,
            task.title,
            task.description,
            task.employee_id,
            task.priority,
            task.due_date,
            task.status,
            id,
        ],
        (err, results) => {
            if (err && err.code === 'ER_BAD_FIELD_ERROR') {
                // retry update without task_id if column missing
                const sql2 = `
                    UPDATE tasks
                    SET
                        task_code = ?,
                        title = ?,
                        description = ?,
                        employee_id = ?,
                        priority = ?,
                        due_date = ?,
                        status = ?
                    WHERE id = ?
                `;
                return db.query(
                    sql2,
                    [
                        task.task_code,
                        task.title,
                        task.description,
                        task.employee_id,
                        task.priority,
                        task.due_date,
                        task.status,
                        id,
                    ],
                    callback
                );
            }
            callback(err, results);
        }
    );
};

// Delete Task
const deleteTask = (id, callback) => {
    const sql = `DELETE FROM tasks WHERE id = ?`;

    db.query(sql, [id], callback);
};

module.exports = {
    createTasks,
    getTaskByCode,
    getTaskByTaskId,
    getTaskByCodeExceptId,
    getTaskByTaskIdExceptId,
    getAllTasks,
    updateTask,
    deleteTask,
};