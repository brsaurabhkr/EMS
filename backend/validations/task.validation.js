const { z } = require("zod");

const createTaskValidation = z.object({
    task_id: z.coerce.number().int().positive("Task ID must be a positive whole number"),

    task_code: z.string().min(1, "Task code is required"),

    title: z.string().min(3, "Title must be at least 3 characters"),

    description: z.string().optional(),

    employee_id: z.number().int("Employee ID must be an integer"),

    priority: z.enum(["Low", "Medium", "High"]),

    due_date: z.string(),

    status: z.enum([
        "Pending",
        "In Progress",
        "Completed",
    ]),
});

const updateTaskValidation = createTaskValidation;

// Validation for PATCH /tasks/:id/status
const updateTaskStatusValidation = z.object({
    status: z.enum([
        "Pending",
        "In Progress",
        "Completed",
    ]),
});

module.exports = {
    createTaskValidation,
    updateTaskValidation,
    updateTaskStatusValidation,
};
