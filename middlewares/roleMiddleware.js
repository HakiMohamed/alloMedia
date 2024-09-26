const Role = require('../models/role');
const User = require('../models/user');

const roleMiddleware = (requiredRoles) => {
  return async (req, res, next) => {
    const user = await User.findById(req.user).populate('roles');
    const userRoles = user.roles.map(role => role.role_name);

    if (!requiredRoles.some(role => userRoles.includes(role))) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

module.exports = roleMiddleware;
