//C:\Users\Youcode\Desktop\AlloMedia\controllers\resetpasswordController.js
const { validationResult } = require('express-validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 
const { sendResetPasswordEmail } = require('../services/emailService'); 

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User with this email does not exist.' });
    }
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    const resetUrl = `${process.env.APP_FRENT_HOST}:${process.env.APP_FRENT_PORT}/reset-password?token=${token}`;
    await sendResetPasswordEmail(user.email, user.name, resetUrl);
    res.status(200).json({ message: 'Password reset email has been sent.' });
  } catch (error) {
    console.error('Error during password reset request:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const resetPassword = async (req, res) => {
  const { newPassword, token } = req.body;
  if (!token) {
    return res.status(400).json({ message: 'Token is required.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (error) {
    console.error('Error during password reset:', error);
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ message: 'Token has expired.' });
    }
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};
