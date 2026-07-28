const db = require("../config/db.config");

const getDashboard = (req, res) => {
  const dashboardQuery = `
    SELECT
      (SELECT COUNT(*) FROM designations) AS totalDesignations,
      (SELECT COUNT(*) FROM employees) AS totalEmployees,
      (SELECT COUNT(*) FROM tasks) AS totalTasks,
      (SELECT COUNT(*) FROM tasks WHERE status = 'Pending') AS pendingTasks,
      (SELECT COUNT(*) FROM tasks WHERE status = 'In Progress') AS inProgressTasks,
      (SELECT COUNT(*) FROM tasks WHERE status = 'Completed') AS completedTasks;
  `;

  db.query(dashboardQuery, (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Failed to fetch dashboard data",
        error: err.message,
      });
    }

    res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: results[0],
    });
  });
};

module.exports = {
  getDashboard,
};