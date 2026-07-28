const { z } = require("zod");

const createDesignationValidation = z.object({
    designation_id: z.number().int().positive(),

    designation_name: z
        .string()
        .min(2, "Designation name is required"),

    description: z
        .string()
        .optional(),

    status: z.enum(["Active", "Inactive"]),
});

const updateDesignationValidation = createDesignationValidation;

module.exports = {
    createDesignationValidation,
    updateDesignationValidation,
};
