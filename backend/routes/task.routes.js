const express = require("express");
const router = express.Router();

const taskController = require("../controllers/task.controller");
const validate = require("../middlewares/validate.middleware");

const {
  createTaskValidation,
  updateTaskValidation,
  updateTaskStatusValidation,
} = require("../validations/task.validation");

router.get("/", taskController.getTasks);

router.get("/:id", taskController.getTaskById);

router.post(
  "/",
  validate(createTaskValidation),
  taskController.createTask
);

router.put(
  "/:id",
  validate(updateTaskValidation),
  taskController.updateTask
);

router.patch(
  "/:id/status",
  validate(updateTaskStatusValidation),
  taskController.updateTaskStatus
);

router.delete("/:id", taskController.deleteTask);

module.exports = router;
