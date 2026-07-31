const { randomUUID } = require("crypto");
const roleModel = require("../models/role.model");

const VALID_PERMISSIONS = new Set([
  "dashboard.view",
  "employee.view", "employee.create", "employee.update", "employee.delete",
  "designation.view", "designation.create", "designation.update", "designation.delete",
  "task.view", "task.create", "task.update", "task.delete", "task.change_status",
]);

const validateRole = (body) => {
  if (typeof body.roleName !== "string" || body.roleName.trim().length < 2 || body.roleName.trim().length > 50) return "Role name must be between 2 and 50 characters.";
  if (typeof body.description !== "string" || body.description.length < 5 || body.description.length > 255) return "Description must be between 5 and 255 characters.";
  if (!["Active", "Inactive"].includes(body.status)) return "Status must be Active or Inactive.";
  return null;
};

const listRoles = async (req, res, next) => {
  try {
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    res.json({ success: true, data: await roleModel.findAll(search) });
  } catch (error) { next(error); }
};

const getRole = async (req, res, next) => {
  try {
    const role = await roleModel.findById(req.params.id);
    if (!role) return res.status(404).json({ success: false, message: "Role not found." });
    res.json({ success: true, data: role });
  } catch (error) { next(error); }
};

const createRole = async (req, res, next) => {
  const message = validateRole(req.body);
  if (message) return res.status(400).json({ success: false, message });
  try {
    const role = await roleModel.create({ id: randomUUID(), ...req.body, roleName: req.body.roleName.trim() });
    res.status(201).json({ success: true, message: "Role created successfully.", data: role });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ success: false, message: "A role with this name already exists." });
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  const message = validateRole(req.body);
  if (message) return res.status(400).json({ success: false, message });
  try {
    const role = await roleModel.update(req.params.id, { ...req.body, roleName: req.body.roleName.trim() });
    if (!role) return res.status(404).json({ success: false, message: "Role not found." });
    res.json({ success: true, message: "Role updated successfully.", data: role });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ success: false, message: "A role with this name already exists." });
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const result = await roleModel.remove(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: "Role not found." });
    res.json({ success: true, message: "Role deleted successfully." });
  } catch (error) { next(error); }
};

const getRolePermissions = async (req, res, next) => {
  try {
    if (!await roleModel.findById(req.params.id)) return res.status(404).json({ success: false, message: "Role not found." });
    res.json({ success: true, data: { permissions: await roleModel.getPermissions(req.params.id) } });
  } catch (error) { next(error); }
};

const saveRolePermissions = async (req, res, next) => {
  const { permissions } = req.body;
  if (!Array.isArray(permissions) || permissions.some((permission) => !VALID_PERMISSIONS.has(permission))) {
    return res.status(400).json({ success: false, message: "Permissions are invalid." });
  }
  try {
    if (!await roleModel.findById(req.params.id)) return res.status(404).json({ success: false, message: "Role not found." });
    const saved = await roleModel.setPermissions(req.params.id, [...new Set(permissions)]);
    res.json({ success: true, message: "Role permissions saved successfully.", data: { permissions: saved } });
  } catch (error) { next(error); }
};

module.exports = { listRoles, getRole, createRole, updateRole, deleteRole, getRolePermissions, saveRolePermissions };
