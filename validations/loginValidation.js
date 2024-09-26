//C:\Users\Youcode\Desktop\AlloMedia\validations\loginValidation.js
const { check } = require('express-validator');

const loginValidation = [
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('password').notEmpty().withMessage('Password is required')
];

module.exports = loginValidation;
