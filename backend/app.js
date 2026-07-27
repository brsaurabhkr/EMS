const express = require("express")
const cors = require("cors")
require("./config/db.config")

const app = express();

app.use(cors())
app.use(express.json())

const designationRoutes = require("./routes/designation.routes")
app.use("/api/designation",designationRoutes)

const employeeRoutes = require("./routes/employee.routes")
app.use("/api/employees",employeeRoutes)

const taskRoutes = require("./routes/task.routes")
app.use("/api/tasks",taskRoutes)


module.exports = app; 