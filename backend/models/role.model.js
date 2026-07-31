const db = require("../config/db.config");

const query = (sql, values = []) =>
  new Promise((resolve, reject) => {
    db.query(sql, values, (error, results) => {
      if (error) return reject(error);
      resolve(results);
    });
  });

/**
 * Get All Roles
 */
const findAll = (search = "") =>
  query(`
    SELECT
      id,
      role_name AS roleName,
      description,
      status
    FROM roles
    WHERE role_name LIKE ? OR description LIKE ?
    ORDER BY role_name ASC
  `, [`%${search}%`, `%${search}%`]);

/**
 * Get Role By Id
 */
const findById = async (id) => {
  const rows = await query(
    `
    SELECT
      id,
      role_name AS roleName,
      description,
      status
    FROM roles
    WHERE id = ?
    `,
    [id]
  );

  return rows[0] || null;
};

/**
 * Find Active Role By Name
 */
const findActiveByName = async (name) => {
  const rows = await query(
    `
    SELECT
      id,
      role_name AS roleName,
      description,
      status
    FROM roles
    WHERE LOWER(role_name) = LOWER(?)
      AND status = 'Active'
    `,
    [name]
  );

  return rows[0] || null;
};

/**
 * Create Role
 */
const create = async ({ id, roleName, description, status }) => {
  await query(
    `
    INSERT INTO roles
    (
      id,
      role_name,
      description,
      status
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      id,
      roleName,
      description || null,
      status,
    ]
  );

  return findById(id);
};

/**
 * Update Role
 */
const update = async (id, { roleName, description, status }) => {
  await query(
    `
    UPDATE roles
    SET
      role_name = ?,
      description = ?,
      status = ?
    WHERE id = ?
    `,
    [
      roleName,
      description || null,
      status,
      id,
    ]
  );

  return findById(id);
};

const remove = async (id) => {
  await query("DELETE FROM role_permissions WHERE role_id = ?", [id]);
  const result = await query("DELETE FROM roles WHERE id = ?", [id]);
  return result;
};

/**
 * Get Role Permissions
 */
const getPermissions = async (roleId) => {
  const rows = await query(
    `
    SELECT permission
    FROM role_permissions
    WHERE role_id = ?
    ORDER BY permission
    `,
    [roleId]
  );

  return rows.map((row) => row.permission);
};

/**
 * Save Role Permissions
 */
const { randomUUID } = require("crypto");

const setPermissions = async (roleId, permissions) => {
  await query(
    "DELETE FROM role_permissions WHERE role_id = ?",
    [roleId]
  );

  for (const permission of permissions) {
    await query(
      `
      INSERT INTO role_permissions
      (
        id,
        role_id,
        permission
      )
      VALUES (?, ?, ?)
      `,
      [
        randomUUID(),
        roleId,
        permission,
      ]
    );
  }

  return getPermissions(roleId);
};

module.exports = {
  findAll,
  findById,
  findActiveByName,
  create,
  update,
  remove,
  getPermissions,
  setPermissions,
};