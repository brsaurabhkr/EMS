const express = require("express");
const controller = require("../controllers/role.controller");
const { requireAuth, requireAdmin } = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(requireAuth, requireAdmin);
router.get("/", controller.listRoles);
router.post("/", controller.createRole);
router.get("/:id", controller.getRole);
router.put("/:id", controller.updateRole);
router.delete("/:id", controller.deleteRole);
router.get("/:id/permissions", controller.getRolePermissions);
router.put("/:id/permissions", controller.saveRolePermissions);

module.exports = router;
