const express = require("express");
const router = express.Router();

const employeeController = require("../controllers/employee.controller");
const validate = require("../middlewares/validate.middleware");

const {
  createEmployeeValidation,
  updateEmployeeValidation,
} = require("../validations/employee.validation");

router.get("/", employeeController.getEmployees);

router.get("/:id", employeeController.getEmployeeById);

router.post(
  "/",
  validate(createEmployeeValidation),
  employeeController.createEmployee
);

router.put(
  "/:id",
  validate(updateEmployeeValidation),
  employeeController.updateEmployee
);

router.delete("/:id", employeeController.deleteEmployee);

module.exports = router;
