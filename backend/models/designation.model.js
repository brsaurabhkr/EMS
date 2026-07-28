const db = require("../config/db.config");

const findAll = (callback) => {
    db.query("SELECT designation_id AS id, designation_name, description, status FROM designations", callback);
};

const findById = (id, callback) => {
    db.query(
        "SELECT designation_id AS id, designation_name, description, status FROM designations WHERE designation_id = ?",
        [id],
        callback
    );
};

const create = (data, callback) => {
    const sql = `
        INSERT INTO designations
        (designation_id, designation_name, description, status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [data.designation_id, data.designation_name, data.description, data.status],
        callback
    );
};

const update = (id, data, callback) => {
    const sql = `
        UPDATE designations
        SET designation_name=?, description=?, status=?
        WHERE designation_id=?
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
        "DELETE FROM designations WHERE designation_id=?",
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
