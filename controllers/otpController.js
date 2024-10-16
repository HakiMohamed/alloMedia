//C:\Users\Youcode\Desktop\AlloMedia\controllers\otpController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {sendOtpEmail } = require('../services/emailService');

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'OTP invalide' });
    }
    const device = user.devices.find(d => d.userAgent === req.headers['user-agent']);
    if (device) {
      device.isVerified = true;
    }
    user.otp = null;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '48h' });
    return res.status(200).json({ message: 'Appareil vérifié avec succès', token });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const otp = generateOtp();
    user.otp = otp;
    await user.save();
    await sendOtpEmail(user.email, user.name, otp);
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();



module.exports = {
  verifyOtp,sendOtp,
};



