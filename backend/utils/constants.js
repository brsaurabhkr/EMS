// Employee & Designation Status
const STATUS = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
};

// Task Status
const TASK_STATUS = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
};

// Task Priority
const PRIORITY = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
};

// Common Messages
const MESSAGES = {
    FETCH_SUCCESS: "Data fetched successfully.",
    CREATE_SUCCESS: "Record created successfully.",
    UPDATE_SUCCESS: "Record updated successfully.",
    DELETE_SUCCESS: "Record deleted successfully.",

    FETCH_ERROR: "Failed to fetch data.",
    CREATE_ERROR: "Failed to create record.",
    UPDATE_ERROR: "Failed to update record.",
    DELETE_ERROR: "Failed to delete record.",

    VALIDATION_ERROR: "Validation failed.",
    NOT_FOUND: "Record not found.",
    SERVER_ERROR: "Internal server error.",
};

module.exports = {
    STATUS,
    TASK_STATUS,
    PRIORITY,
    MESSAGES,
};