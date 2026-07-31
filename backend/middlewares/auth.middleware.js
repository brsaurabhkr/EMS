const jwt = require("jsonwebtoken");
const roleModel = require("../models/role.model");

const isAdmin = (roleName) => ["admin", "administrator"].includes(String(roleName).toLowerCase());

const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: "Please sign in to continue." });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (isAdmin(payload.role)) {
      req.user = { id: payload.id, role: payload.role, permissions: ["*"] };
      return next();
    }
    const role = await roleModel.findActiveByName(payload.role);
    if (!role) return res.status(403).json({ success: false, message: "Your role is inactive or unavailable." });
    req.user = { id: payload.id, role: role.roleName, permissions: await roleModel.getPermissions(role.id) };
    next();
  } catch (error) {
    if (["JsonWebTokenError", "TokenExpiredError"].includes(error.name)) return res.status(401).json({ success: false, message: "Your session has expired. Please sign in again." });
    next(error);
  }
};

const requireAdmin = (req, res, next) => {
  if (isAdmin(req.user?.role)) return next();
  return res.status(403).json({ success: false, message: "Only Admin can manage roles and permissions." });
};

const requirePermission = (permission) => (req, res, next) => {
  if (req.user?.permissions.includes("*") || req.user?.permissions.includes(permission)) return next();
  return res.status(403).json({ success: false, message: "You do not have permission for this action." });
};

module.exports = { requireAuth, requireAdmin, requirePermission };
