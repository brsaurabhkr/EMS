const permissions = {
  Dashboard: [
    {
      label: "View",
      value: "dashboard.view",
    },
  ],

  Employee: [
    {
      label: "View",
      value: "employee.view",
    },
    {
      label: "Create",
      value: "employee.create",
    },
    {
      label: "Edit",
      value: "employee.update",
    },
    {
      label: "Delete",
      value: "employee.delete",
    },
  ],

  Designation: [
    {
      label: "View",
      value: "designation.view",
    },
    {
      label: "Create",
      value: "designation.create",
    },
    {
      label: "Edit",
      value: "designation.update",
    },
    {
      label: "Delete",
      value: "designation.delete",
    },
  ],

  Task: [
    {
      label: "View",
      value: "task.view",
    },
    {
      label: "Create",
      value: "task.create",
    },
    {
      label: "Edit",
      value: "task.update",
    },
    {
      label: "Delete",
      value: "task.delete",
    },
    {
      label: "Change Status",
      value: "task.change_status",
    },
  ],
};

module.exports = permissions;