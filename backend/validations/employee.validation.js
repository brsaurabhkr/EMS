const { z } = require("zod");

const createEmployeeValidation = z.object({
    employee_code: z.string().min(1),

    employee_name: z.string().min(2),

    designation_id: z.uuid("Designation ID must be a valid UUID"),

    email: z.string().email(),

    mobile: z
        .string()
        .regex(/^[0-9]{10}$/, "Mobile must be 10 digits"),

    status: z.enum(["Active", "Inactive"]),
});

const updateEmployeeValidation = createEmployeeValidation;

module.exports = {
    createEmployeeValidation,
    updateEmployeeValidation,
};
