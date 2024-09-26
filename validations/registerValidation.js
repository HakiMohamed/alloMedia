//C:\Users\Youcode\Desktop\AlloMedia\validations\registerValidation.js
const { body } = require('express-validator');
const User = require('../models/user');

const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .isEmail().withMessage('Invalid email')
    .custom(async email => {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

module.exports = registerValidation;
