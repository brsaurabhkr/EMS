const designationModel = require("../models/designation.model");

const {
    successResponse,
    errorResponse,
} = require("../utils/response");

const { MESSAGES } = require("../utils/constants");

// Get all designations
const getDesignations = (req, res) => {
    designationModel.findAll((err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.FETCH_ERROR, 500, err.message);
        }

        return successResponse(res, MESSAGES.FETCH_SUCCESS, result);
    });
};

// Get designation by ID
const getDesignationById = (req, res) => {
    designationModel.findById(req.params.id, (err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.FETCH_ERROR, 500, err.message);
        }

        if (result.length === 0) {
            return errorResponse(res, MESSAGES.NOT_FOUND, 404);
        }

        return successResponse(res, MESSAGES.FETCH_SUCCESS, result[0]);
    });
};

// Create designation
const createDesignation = (req, res) => {
    designationModel.create(req.body, (err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.CREATE_ERROR, 500, err.message);
        }

        return successResponse(
            res,
            MESSAGES.CREATE_SUCCESS,
            { id: req.body.designation_id },
            201
        );
    });
};

// Update designation
const updateDesignation = (req, res) => {
    designationModel.update(req.params.id, req.body, (err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.UPDATE_ERROR, 500, err.message);
        }

        return successResponse(res, MESSAGES.UPDATE_SUCCESS);
    });
};

// Delete designation
const deleteDesignation = (req, res) => {
    designationModel.delete(req.params.id, (err, result) => {
        if (err) {
            return errorResponse(res, MESSAGES.DELETE_ERROR, 500, err.message);
        }

        return successResponse(res, MESSAGES.DELETE_SUCCESS);
    });
};

module.exports = {
    getDesignations,
    getDesignationById,
    createDesignation,
    updateDesignation,
    deleteDesignation,
};
