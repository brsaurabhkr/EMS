const mysql = require("mysql2")
require("dotenv").config()

const path = require("path")
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") })

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT || 3306)
})

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed :", err)
    } else {
        console.log("Database Connected Successfully")
    }
})

module.exports = db;