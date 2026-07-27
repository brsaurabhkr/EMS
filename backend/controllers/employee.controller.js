const Employee = require("../models/employee.model");
const db = require("../config/db.config");

const getEmployees = (req, res) => {
    Employee.getAllEmployees((err, results) => {
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

const resolveDesignationId = (designationValue, callback) => {
    if (designationValue === undefined || designationValue === null) {
        return callback(new Error("Designation is required"));
    }

    const numericId = Number(designationValue);
    if (!Number.isNaN(numericId) && String(numericId) === String(designationValue)) {
        db.query(
            "SELECT id FROM designations WHERE id = ?",
            [numericId],
            (err, results) => {
                if (err) return callback(err);
                if (!results.length) return callback(new Error(`Designation id ${numericId} not found`));
                callback(null, results[0].id);
            }
        );
        return;
    }

    db.query(
        "SELECT id FROM designations WHERE designation_name = ?",
        [designationValue],
        (err, results) => {
            if (err) return callback(err);
            if (!results.length) return callback(new Error(`Designation '${designationValue}' not found`));
            callback(null, results[0].id);
        }
    );
};

const ensureDesignationIsAvailable = (designationId, employeeId, callback) => {
    db.query(
        "SELECT id FROM employee WHERE designation_id = ? AND id != ?",
        [designationId, employeeId || 0],
        (err, results) => {
            if (err) return callback(err);
            if (results.length) {
                return callback(new Error(`Designation ID '${designationId}' is already assigned to another employee`));
            }
            callback(null);
        }
    );
};

const createEmployees = (req, res) => {
    const { id, employee_code, email } = req.body;

    db.query(
        "SELECT id, employee_code, email FROM employee WHERE id = ? OR employee_code = ? OR email = ?",
        [id, employee_code, email],
        (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            if (results.some((employee) => employee.id === Number(id))) {
                return res.status(409).json({
                    success: false,
                    message: `Employee ID '${id}' is already in use`,
                });
            }

            if (results.some((employee) => employee.employee_code === employee_code)) {
                return res.status(409).json({
                    success: false,
                    message: `Employee code '${employee_code}' is already in use`,
                });
            }

            if (results.some((employee) => employee.email === email)) {
                return res.status(409).json({
                    success: false,
                    message: `Email '${email}' is already in use`,
                });
            }

            resolveDesignationId(req.body.designation ?? req.body.designation_id, (err, designation_id) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message,
                    });
                }

                ensureDesignationIsAvailable(designation_id, null, (availabilityError) => {
                    if (availabilityError) {
                        return res.status(409).json({ success: false, message: availabilityError.message });
                    }

                    const employee = {
                        id: Number(id),
                        employee_code: req.body.employee_code,
                        employee_name: req.body.employee_name,
                        designation_id,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        status: req.body.status,
                    };

                    Employee.createEmployee(employee, (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message,
                            });
                        }

                        res.status(201).json({
                            success: true,
                            message: "Employee Added Successfully",
                            data: result,
                        });
                    });
                });
            });
        }
    );
};

const updateEmployee = (req, res) => {
    const id = req.params.id;
    const { employee_code } = req.body;

    db.query(
        "SELECT id FROM employee WHERE employee_code = ? AND id != ?",
        [employee_code, id],
        (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            if (results.length) {
                return res.status(409).json({
                    success: false,
                    message: `Employee code '${employee_code}' is already in use by another employee`,
                });
            }

            resolveDesignationId(req.body.designation ?? req.body.designation_id, (err, designation_id) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message,
                    });
                }

                ensureDesignationIsAvailable(designation_id, id, (availabilityError) => {
                    if (availabilityError) {
                        return res.status(409).json({ success: false, message: availabilityError.message });
                    }

                    const employee = {
                        employee_code: req.body.employee_code,
                        employee_name: req.body.employee_name,
                        designation_id,
                        email: req.body.email,
                        mobile: req.body.mobile,
                        status: req.body.status,
                    };

                    Employee.updateEmployee(id, employee, (err, result) => {
                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: err.message,
                            });
                        }

                        if (result.affectedRows === 0) {
                            return res.status(404).json({
                                success: false,
                                message: "Employee not found",
                            });
                        }

                        res.json({
                            success: true,
                            message: "Employee updated successfully",
                            data: result,
                        });
                    });
                });
            });
        }
    );
};

const deleteEmployee = (req, res) => {
    const id = req.params.id;

    Employee.deleteEmployee(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Employee not found",
            });
        }

        res.json({
            success: true,
            message: "Employee deleted successfully",
            data: result,
        });
    });
};

module.exports = {
    getEmployees,
    createEmployees,
    updateEmployee,
    deleteEmployee,
};
