const express = require("express");
const router = express.Router();

const designationController = require("../controllers/designation.controller");

const validate = require("../middlewares/validate.middleware");

const {
    createDesignationValidation,
    updateDesignationValidation,
} = require("../validations/designation.validation");

router.get("/", designationController.getDesignations);

router.get("/:id", designationController.getDesignationById);

router.post(
    "/",
    validate(createDesignationValidation),
    designationController.createDesignation
);

router.put(
    "/:id",
    validate(updateDesignationValidation),
    designationController.updateDesignation
);

router.delete("/:id", designationController.deleteDesignation);

module.exports = router;