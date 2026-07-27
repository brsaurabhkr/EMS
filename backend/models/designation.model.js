const db = require("../config/db.config");

const createDesignation = (designation, callback) => {
    const sql = `
        INSERT INTO designations
        (id, designation_name, description, status)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            designation.designation_id || null,
            designation.designation_name,
            designation.description,
            designation.status,
        ],
        callback
    );
};

const getAllDesignations = (callback) => {
    const sql = `SELECT id, designation_name, description, status FROM designations`;
    db.query(sql, callback);
};

const updateDesignation = (id, designation, callback) => {
    const sql = `
        UPDATE designations
        SET designation_name = ?, description = ?, status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            designation.designation_name,
            designation.description,
            designation.status,
            id,
        ],
        callback
    );
};

const checkDesignationId = (designationId, callback) => {
    if (!designationId) return callback(null, []);
    const sql = `SELECT id FROM designations WHERE id = ?`;
    db.query(sql, [designationId], callback);
};

const deleteDesignation = (id, callback) => {
    const sql = `DELETE FROM designations WHERE id = ?`;
    db.query(sql, [id], callback);
};

module.exports = {
    createDesignation,
    getAllDesignations,
    updateDesignation,
    deleteDesignation,
    checkDesignationId,
};