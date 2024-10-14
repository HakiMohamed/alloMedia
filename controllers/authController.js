// C:\Users\Youcode\Desktop\AlloMedia\controllers\authController.js
const { validationResult } = require('express-validator');
const User = require('../models/user');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail, sendOtpEmail } = require('../services/emailService');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, phoneNumber, roles } = req.body;
  const userAgent = req.headers['user-agent'];

  
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: 'Email already in use' }] });
    }

   
   

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      devices: [{ userAgent, isVerified: true }],
    });

    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }

    if (roles && roles.length > 0) {
      const foundRoles = await Role.find({ _id: { $in: roles } });
      user.roles = foundRoles.map(role => role._id);
    }

    await user.save();

    console.log('JWT Secret:', process.env.JWT_SECRET);  
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
    console.log('Generated Token:', token);  

    const verificationUrl = `${process.env.APP_HOST}${process.env.APP_FRENT_PORT}/verify-email?token=${token}`;

    await sendVerificationEmail(email, name, verificationUrl);

    return res.status(201).json({
      message: 'Congratulations!, you registered successfully. A verification email has been sent.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,  
        permissions: user.permissions,
        devices: user.devices
      },
      token,
    });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ message: 'Token is required.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification link.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'User already verified.' });
    }

    user.isVerified = true;
    await user.save();

    return res.status(200).json({ message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Error verifying email:', error);
    
    if (error instanceof jwt.TokenExpiredError) {
      try {
        const decoded = jwt.decode(token);
        if (!decoded || !decoded.id) {
          return res.status(400).json({message:'Invalid token structure'});

        }

        const user = await User.findById(decoded.id);
        if (!user) {
          return res.status(400).json({message:'User not found'});
        }

        if (!user.isVerified) {
          const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
          const verificationUrl = `${process.env.APP_HOST}${process.env.APP_FRENT_PORT}/verify-email?token=${newToken}`;
          await sendVerificationEmail(user.email, user.name, verificationUrl);

          return res.status(400).json({ 
            message: 'Verification link expired. A new verification email has been sent.',
            expired: true,
            newEmailSent: true
          });
        } else {
          return res.status(400).json({ message: 'User already verified.' });
        }
      } catch (resendError) {
        console.error('Error resending verification email:', resendError);
        return res.status(400).json({ 
          message: 'Verification token expired. Please request a new verification email.',
          expired: true,
          newEmailSent: false
        });
      }
    } else {
      return res.status(400).json({ message: 'Invalid verification link. Please request a new one.' });
    }
  }
};


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('roles').populate('permissions');
    console.log('User found:', user); 
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    console.log('User password:', user.password);

    if (!user.password) {
      return res.status(500).json({ message: 'User password is missing or undefined' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isVerified) {

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const verificationUrl = `${process.env.APP_HOST}${process.env.APP_FRENT_PORT}/verify-email?token=${token}`;

    await sendVerificationEmail(email, user.name, verificationUrl);
      return res.status(403).json({ message: 'User not verified. Please verify your email.' });
    }

    const currentDevice = {
      userAgent: req.headers['user-agent'],
    };

    const existingDevice = user.devices.find(
      device =>  device.userAgent === currentDevice.userAgent
    );

    if (!existingDevice) {
      const otp = generateOtp();
      await sendOtpEmail(user.email, user.name, otp);
      user.otp = otp; 
      user.devices.push({
        userAgent: currentDevice.userAgent,
        isVerified: false,  
        loginAt: Date.now()
      });

      await user.save();

      return res.status(403).json({ message: 'New device detected. Please verify OTP.', device: currentDevice });
    }

    if (!existingDevice.isVerified) {
      const otp = generateOtp();
      await sendOtpEmail(user.email, user.name, otp);
      user.otp = otp;

      await user.save();

      return res.status(403).json({ message: 'Device not verified. Please verify OTP.', device: currentDevice });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET is not defined in environment variables' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '48h' });
    return res.status(200).json({ 
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        roles: user.roles,  
        permissions: user.permissions,
        devices: user.devices
      } 
    });

  } catch (error) {
    console.error('Error during login:', error.message);
    return res.status(500).json({ message: 'Server error' });
  }
};



const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

module.exports = {
  register,
  verifyEmail,
  login,
};
