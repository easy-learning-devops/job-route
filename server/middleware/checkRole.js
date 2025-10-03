// middleware/checkRole.js

/**
 * Middleware to check if the authenticated user has one of the allowed roles.
 * @param {...string} allowedRoles - A list of roles that are allowed to access the route.
 */
module.exports = function (...allowedRoles) {
  return (req, res, next) => {
    // req.user should be populated by the 'auth' middleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Forbidden: Access is denied" });
    }
    next();
  };
};
