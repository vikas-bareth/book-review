const ApiError = require("../utils/ApiError");

const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    throw new ApiError(401, "Only admin can perform this action");
  }
  next();
};

module.exports = requireAdmin;
