const db = require("../config/db.config");

const findUserByEmail = (email) =>
  new Promise((resolve, reject) => {
    db.query("SELECT * FROM users WHERE email = ? LIMIT 1", [email], (error, rows) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(rows[0] || null);
    });
  });

module.exports = {
  findUserByEmail,
};
