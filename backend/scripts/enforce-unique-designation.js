const db = require("../config/db.config");

db.query(
  `
    SELECT designation_id, COUNT(*) AS employee_count
    FROM employee
    GROUP BY designation_id
    HAVING COUNT(*) > 1
  `,
  (duplicateError, duplicateAssignments) => {
    if (duplicateError) {
      console.error("Unable to check designation assignments:", duplicateError.message);
      process.exitCode = 1;
      db.end();
      return;
    }

    if (duplicateAssignments.length) {
      console.error("Duplicate designation assignments found:", duplicateAssignments);
      process.exitCode = 1;
      db.end();
      return;
    }

    db.query(
      `
        SELECT 1
        FROM information_schema.table_constraints
        WHERE table_schema = DATABASE()
          AND table_name = "employee"
          AND constraint_name = "uq_employee_designation"
      `,
      (constraintError, constraints) => {
        if (constraintError) {
          console.error("Unable to check database constraints:", constraintError.message);
          process.exitCode = 1;
          db.end();
          return;
        }

        if (constraints.length) {
          console.log("One-employee-per-designation rule is already enforced.");
          db.end();
          return;
        }

        db.query(
          "ALTER TABLE employee ADD CONSTRAINT uq_employee_designation UNIQUE (designation_id)",
          (alterError) => {
            if (alterError) {
              console.error("Unable to add the unique designation constraint:", alterError.message);
              process.exitCode = 1;
            } else {
              console.log("One employee per designation ID is now enforced.");
            }
            db.end();
          }
        );
      }
    );
  }
);
