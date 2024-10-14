// C:\Users\Youcode\Desktop\AlloMedia\controllers\emailController.js
const { validationResult } = require('express-validator');
const User = require('../models/user');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendVerificationEmail, sendOtpEmail } = require('../services/emailService');



const ResendVerificationEmail= async (req, res) => {
    const { email } = req.body;
    console.log('JWT Secret:', process.env.JWT_SECRET);  
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Generated Token:', token);  

    const verificationUrl = `${process.env.APP_HOST}${process.env.APP_FRENT_PORT}/verify-email?token=${token}`;

    await sendVerificationEmail(email, name, verificationUrl);

}