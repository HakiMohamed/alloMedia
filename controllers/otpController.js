//C:\Users\Youcode\Desktop\AlloMedia\controllers\otpController.js
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {sendOtpEmail } = require('../services/emailService');

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  
  const ipAddress = req.ip;
  const userAgent = req.headers['user-agent'];

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'OTP invalide' });
    }

    const deviceIndex = user.devices.findIndex(
      (device) => device.ipAddress === ipAddress && device.userAgent === userAgent
    );

    if (deviceIndex === -1) {
      return res.status(400).json({ message: 'Appareil non trouvé' });
    }

    user.devices[deviceIndex].isVerified = true;
    user.otp = undefined;  
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({ message: 'Appareil vérifié avec succès', token });
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'OTP:', error);
    return res.status(500).json({ message: 'Erreur serveur' });
  }
};

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body; // Get the email from the request body
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOtp();
    const name = 'Sir';
    await sendOtpEmail(user.email, name, otp);
    user.otp = otp;

    await user.save();

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Error sending OTP', error });
  }
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();



module.exports = {
  verifyOtp,sendOtp,
};



