const db = require("../config/db.config");

const findAll = (filters, callback) => {
    const where = [];
    const values = [];
    const search = String(filters.search || "").trim();

    if (search) {
        where.push("(designation_name LIKE ? OR description LIKE ?)");
        values.push(`%${search}%`, `%${search}%`);
    }
    if (filters.status) {
        where.push("status=?");
        values.push(filters.status);
    }

    const sql = `SELECT id, designation_name, description, status FROM designations${where.length ? ` WHERE ${where.join(" AND ")}` : ""} ORDER BY designation_name`;
    db.query(sql, values, callback);
};

const findById = (id, callback) => {
    db.query(
        "SELECT id, designation_name, description, status FROM designations WHERE id = ?",
        [id],
        callback
    );
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO designations
        (id, designation_name, description, status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [data.id, data.designation_name, data.description, data.status],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE designations
        SET designation_name=?, description=?, status=?
        WHERE id=?
    `;

    db.query(
        sql,
        [
            data.designation_name,
            data.description,
            data.status,
            id,
        ],
        callback
    );
};

const remove = (id, callback) => {
    db.query(
        "DELETE FROM designations WHERE id=?",
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
