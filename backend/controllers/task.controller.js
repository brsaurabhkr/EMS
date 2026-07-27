const Task = require("../models/task.model");
const db = require("../config/db.config");

const getTasks = (req, res) => {
    Task.getAllTasks((err, results) => {
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

// Create Task
const createTasks = (req, res) => {
    const task = {
        task_id: req.body.task_id,
        task_code: req.body.task_code,
        title: req.body.title,
        description: req.body.description,
        employee_id: req.body.employee_id,
        priority: req.body.priority,
        due_date: req.body.due_date,
        status: req.body.status,
    };

    
    if (task.employee_id) {
        db.query("SELECT id FROM employee WHERE id = ?", [task.employee_id], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (results.length === 0) return res.status(400).json({ success: false, message: "Assigned employee not found" });
            // validate due_date format YYYY-MM-DD
            if (task.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(task.due_date)) {
                return res.status(400).json({ success: false, message: "Due date must be in YYYY-MM-DD format" });
            }

            // continue with existing uniqueness checks
            proceedCreate();
        });
    } else {
        if (task.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(task.due_date)) {
            return res.status(400).json({ success: false, message: "Due date must be in YYYY-MM-DD format" });
        }
        proceedCreate();
    }

    function proceedCreate() {
        Task.getTaskByTaskId(task.task_id, (err, taskIdResults) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            if (taskIdResults.length) {
                return res.status(409).json({ success: false, message: "Task ID already exists" });
            }

            Task.getTaskByCode(task.task_code, (err, codeResults) => {
                if (err) {
                    return res.status(500).json({ success: false, message: err.message });
                }

                if (codeResults.length) {
                    return res.status(409).json({ success: false, message: "Task code already exists" });
                }

                Task.createTasks(task, (err, result) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: err.message });
                    }

                    res.status(201).json({ success: true, message: "Task Added Successfully", data: result });
                });
            });
        });
    }
};

// Update Task
const updateTask = (req, res) => {
    const id = req.params.id;

    const task = {
        task_id: req.body.task_id,
        task_code: req.body.task_code,
        title: req.body.title,
        description: req.body.description,
        employee_id: req.body.employee_id,
        priority: req.body.priority,
        due_date: req.body.due_date,
        status: req.body.status,
    };

    // validate employee existence and due_date format first
    const validateAndProceed = () => {
        Task.getTaskByTaskIdExceptId(task.task_id, id, (err, taskIdResults) => {
            if (err) {
                return res.status(500).json({ success: false, message: err.message });
            }

            if (taskIdResults.length) {
                return res.status(409).json({ success: false, message: "Task ID already exists" });
            }

            Task.getTaskByCodeExceptId(task.task_code, id, (err, codeResults) => {
                if (err) {
                    return res.status(500).json({ success: false, message: err.message });
                }

                if (codeResults.length) {
                    return res.status(409).json({ success: false, message: "Task code already exists" });
                }

                Task.updateTask(id, task, (err, result) => {
                    if (err) {
                        return res.status(500).json({ success: false, message: err.message });
                    }

                    if (result.affectedRows === 0) {
                        return res.status(404).json({ success: false, message: "Task not found" });
                    }

                    res.json({ success: true, message: "Task updated successfully", data: result });
                });
            });
        });
    };

    if (task.employee_id) {
        db.query("SELECT id FROM employee WHERE id = ?", [task.employee_id], (err, results) => {
            if (err) return res.status(500).json({ success: false, message: err.message });
            if (results.length === 0) return res.status(400).json({ success: false, message: "Assigned employee not found" });
            if (task.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(task.due_date)) {
                return res.status(400).json({ success: false, message: "Due date must be in YYYY-MM-DD format" });
            }
            validateAndProceed();
        });
    } else {
        if (task.due_date && !/^\d{4}-\d{2}-\d{2}$/.test(task.due_date)) {
            return res.status(400).json({ success: false, message: "Due date must be in YYYY-MM-DD format" });
        }
        validateAndProceed();
    }
};

// Delete Task
const deleteTask = (req, res) => {
    const id = req.params.id;

    Task.deleteTask(id, (err, result) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: err.message,
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Task not found",
            });
        }

        res.json({
            success: true,
            message: "Task deleted successfully",
            data: result,
        });
    });
};

module.exports = {
    getTasks,
    createTasks,
    updateTask,
    deleteTask,
};