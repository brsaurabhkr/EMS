const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { findUserByEmail } = require("../models/user.model");
const roleModel = require("../models/role.model");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if email exists
    const user = await findUserByEmail(email.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    if (typeof user.password !== "string" || !user.password) {
      console.error(`User ${user.id} has no valid password hash`);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const adminUser = ["admin", "administrator"].includes(String(user.role).toLowerCase());
    let permissions = ["*"];
    if (!adminUser) {
      const role = await roleModel.findActiveByName(user.role);
      if (!role) return res.status(403).json({ success: false, message: "Your role is inactive or has not been configured." });
      permissions = await roleModel.getPermissions(role.id);
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      role: user.role,
      permissions,
    });

  } catch (error) {
    console.error("Login failed:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  login,
};
