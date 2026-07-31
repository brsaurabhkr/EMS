const hasPermission = (permission) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const permissions = user.permissions || [];

      if (!permissions.includes(permission)) {
        return res.status(403).json({
          success: false,
          message: "Permission denied",
        });
      }

      next();
    } catch (error) {
      console.error("Permission Middleware Error:", error);

      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  };
};

module.exports = hasPermission;