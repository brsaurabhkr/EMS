const Designation = require("../models/designation.model");

const getDesignations = (req, res) => {
    Designation.getAllDesignations((err, results) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }

        res.json({
            success: true,
            data: results,
        });
    });
};

const addDesignation = (req, res) => {
        const designation = {
        designation_id: req.body.designation_id,
        designation_name: req.body.designation_name,
        description: req.body.description,
        status: req.body.status,
    };

    Designation.checkDesignationId(designation.designation_id, (err, idResults) => {
        if (err) {
            return res.status(500).json({ success: false, message: err.message });
        }

        if (designation.designation_id && idResults.length) {
            return res.status(400).json({ success: false, message: "Designation ID already exists" });
        }

        Designation.createDesignation(designation, (err, result) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }

            res.status(201).json({
                success: true,
                message: "Designation Added Successfully",
                data: result,
            });
        });
    });
};

const updateDesignation = (req, res) => {
    const id = req.params.id;
    const designation = {
        designation_name: req.body.designation_name,
        description: req.body.description,
        status: req.body.status,
    };

    Designation.updateDesignation(id, designation, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Designation not found",
            });
        }

        res.json({
            success: true,
            message: "Designation updated successfully",
            data: result,
        });
    });
};

const deleteDesignation = (req, res) => {
    const id = req.params.id;

    Designation.deleteDesignation(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Designation not found",
            });
        }

        res.json({
            success: true,
            message: "Designation deleted successfully",
            data: result,
        });
    });
};

module.exports = {
    getDesignations,
    addDesignation,
    updateDesignation,
    deleteDesignation,
};