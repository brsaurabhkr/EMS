const employeeModel = require("../models/employee.model");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");

const { MESSAGES } = require("../utils/constants");

const handleDuplicateEmployeeError = (res, err) => {
    if (err.code !== "ER_DUP_ENTRY") return false;

    if (err.message.includes("mobile")) {
        errorResponse(res, "Mobile number already exists.", 409);
    } else if (err.message.includes("email")) {
        errorResponse(res, "Email address already exists.", 409);
    } else if (err.message.includes("employee_code")) {
        errorResponse(res, "Employee code already exists.", 409);
    } else {
        errorResponse(res, "Employee ID already exists.", 409);
    }

    return true;
};

// Get all employees
const getEmployees = (req, res) => {
    employeeModel.findAll((err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.FETCH_ERROR, 500, err.message);
        }

        return successResponse(res, MESSAGES.FETCH_SUCCESS, result);
    });
};

// Get employee by ID
const getEmployeeById = (req, res) => {
    employeeModel.findById(req.params.id, (err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.FETCH_ERROR, 500, err.message);
        }

        if (result.length === 0) {
            return errorResponse(res, MESSAGES.NOT_FOUND, 404);
        }

        return successResponse(res, MESSAGES.FETCH_SUCCESS, result[0]);
    });
};

// Create employee
const createEmployee = (req, res) => {
    employeeModel.create(req.body, (err, result) => {
        if (err) {
            if (handleDuplicateEmployeeError(res, err)) return;
            return errorResponse(res, MESSAGES.CREATE_ERROR, 500, err.message);
        }

        return successResponse(
            res,
            MESSAGES.CREATE_SUCCESS,
            { id: req.body.id },
            201
        );
    });
};

// Update employee
const updateEmployee = (req, res) => {
    employeeModel.update(req.params.id, req.body, (err, result) => {
        if (err) {
            if (handleDuplicateEmployeeError(res, err)) return;
            return errorResponse(res, MESSAGES.UPDATE_ERROR, 500, err.message);
        }

        if (result.affectedRows === 0) {
            return errorResponse(res, MESSAGES.NOT_FOUND, 404);
        }

        return successResponse(res, MESSAGES.UPDATE_SUCCESS);
    });
};

// Delete employee
const deleteEmployee = (req, res) => {
    employeeModel.delete(req.params.id, (err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.DELETE_ERROR, 500, err.message);
        }

        if (result.affectedRows === 0) {
            return errorResponse(res, MESSAGES.NOT_FOUND, 404);
        }

        return successResponse(res, MESSAGES.DELETE_SUCCESS);
    });
};

module.exports = {
    getEmployees,
    getEmployeeById,
    createEmployee,
    updateEmployee,
    deleteEmployee,
};
