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

    // Include user details in the response
    return res.status(201).json({
      message: 'User registered successfully',
      user: { email: user.email }, // Include the email of the newly created user
      token,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ message: 'Server error' });
  }
};

// Connexion
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); 
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); 
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error(error); 
    return res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {
  register,
  login,
};
