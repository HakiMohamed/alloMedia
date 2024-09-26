const { validationResult } = require('express-validator');
const User = require('../models/user');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, roles } = req.body;

  try {
    const user = new User({ name, email, password });

    if (roles) {
      const foundRoles = await Role.find({ _id: { $in: roles } });
      user.roles = foundRoles.map(role => role._id);
    }

    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    
    return res.status(201).json({
      message: 'User registered successfully',
      user: { email: user.email }, 
      token,
    });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ message: 'Server error' });
  }
};









module.exports = {
    register,
   
  };