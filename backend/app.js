const express = require("express");
const cors = require("cors");
require("./config/db.config");

const routes = require("./routes");
const errorHandler = require("./middlewares/error.middleware");
const authRoutes = require("./routes/auth.routes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);
app.use("/api/auth", authRoutes);

app.use(errorHandler);

module.exports = app;
