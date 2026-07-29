const { z } = require("zod");

const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const isAllowedDueDate = (value) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const maximumDate = new Date(today);
    maximumDate.setDate(maximumDate.getDate() + 30);
    return value >= formatLocalDate(today) && value <= formatLocalDate(maximumDate);
};

const createTaskValidation = z.object({
    task_code: z.string().min(1, "Task code is required"),

    title: z.string().min(3, "Title must be at least 3 characters"),

    description: z.string().optional(),

    employee_id: z.uuid("Employee ID must be a valid UUID"),

    priority: z.enum(["Low", "Medium", "High"]),

    due_date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Due date must use YYYY-MM-DD format")
        .refine(isAllowedDueDate, "Due date must be between today and the next 30 days"),

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
