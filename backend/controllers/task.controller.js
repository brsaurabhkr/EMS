const taskModel = require("../models/task.model");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");

const { MESSAGES } = require("../utils/constants");

// Get all tasks
const getTasks = (req, res) => {
    taskModel.findAll((err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.FETCH_ERROR, 500, err.message);
        }

        return successResponse(res, MESSAGES.FETCH_SUCCESS, result);
    });
};

// Get task by ID
const getTaskById = (req, res) => {
    taskModel.findById(req.params.id, (err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.FETCH_ERROR, 500, err.message);
        }

        if (result.length === 0) {
            return errorResponse(res, MESSAGES.NOT_FOUND, 404);
        }

        return successResponse(res, MESSAGES.FETCH_SUCCESS, result[0]);
    });
};

// Create task
const createTask = (req, res) => {
    taskModel.create(req.body, (err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.CREATE_ERROR, 500, err.message);
        }

        return successResponse(
            res,
            MESSAGES.CREATE_SUCCESS,
            { id: req.body.task_id },
            201
        );
    });
};

// Update task
const updateTask = (req, res) => {
    taskModel.update(req.params.id, req.body, (err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.UPDATE_ERROR, 500, err.message);
        }

        if (result.affectedRows === 0) {
            return errorResponse(res, MESSAGES.NOT_FOUND, 404);
        }

        return successResponse(res, MESSAGES.UPDATE_SUCCESS);
    });
};

// Update task status
const updateTaskStatus = (req, res) => {
    taskModel.update(req.params.id, req.body, (err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.UPDATE_ERROR, 500, err.message);
        }

        if (result.affectedRows === 0) {
            return errorResponse(res, MESSAGES.NOT_FOUND, 404);
        }

        return successResponse(res, "Task status updated successfully");
    });
};

// Delete task
const deleteTask = (req, res) => {
    taskModel.delete(req.params.id, (err, result) => {
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
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
};
