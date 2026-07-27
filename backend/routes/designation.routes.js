const express = require('express');
const router = express.Router();

const designationController = require("../controllers/designation.controller");

router.get("/", designationController.getDesignations);
router.post("/", designationController.addDesignation);
router.put("/:id", designationController.updateDesignation);
router.delete("/:id", designationController.deleteDesignation);

module.exports = router;