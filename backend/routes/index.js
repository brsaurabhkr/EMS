const express = require("express");
const router = express.Router();

router.use("/roles", require("./role.routes"));
router.use("/designations", require("./designation.routes"));
router.use("/employees", require("./employee.routes"));
router.use("/tasks", require("./task.routes"));
router.use("/dashboard", require("./dashboard.routes"));

module.exports = router;
