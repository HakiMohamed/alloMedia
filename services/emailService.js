//C:\Users\Youcode\Desktop\AlloMedia\services\emailService.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
});
  
/**
 * Sends a verification email
 * @param {string} email - The recipient's email address
 * @param {string} name - The user's name
 * @param {string} verificationUrl - Email verification link
 */
const sendVerificationEmail = async (email, name, verificationUrl) => {
  try {
    const mailOptions = {
      from: `${process.env.APP_NAME}`, 
      to: email, 
      subject: 'Verify Your Email Address',
      html: `
        <body style="margin: 0; padding: 0; background-color: #f0f0f5; font-family: 'Helvetica', sans-serif; color: #333;">
          <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; padding-bottom: 30px;">
              <h1 style="font-size: 24px; color: #1d72b8; margin-bottom: 10px;">Welcome to AlloMedia</h1>
              <h2 style="font-size: 18px; font-weight: 400; color: #555;">Hello, ${name}!</h2>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9; border-radius: 8px; text-align: center;">
              <p style="font-size: 16px; margin-bottom: 25px; color: #666;">Thank you for registering! To complete your signup, please verify your email address by clicking the button below:</p>
              <a href="${verificationUrl}" style="display: inline-block; padding: 15px 30px; background-color: #1d72b8; color: #fff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; transition: background-color 0.3s;">Verify Email</a>
              <p style="margin-top: 20px; font-size: 14px; color: #888;">If the button above doesn’t work, you can copy and paste this link into your browser:</p>
              <a href="${verificationUrl}" style="word-wrap: break-word; color: #1d72b8; font-size: 14px;">${verificationUrl}</a>
            </div>
            <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #aaa;">
              <p>If you didn’t sign up, please ignore this email.</p>
              <p>Best regards,</p>
              <p>The AlloMedia Team</p>
            </div>
          </div>
        </body>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to: ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Error sending the email.');
  }
};


/**
 * Sends a password reset email
 * @param {string} email - The recipient's email address
 * @param {string} name - The user's name
 * @param {string} resetUrl - Password reset link
 */
const sendResetPasswordEmail = async (email, name, resetUrl) => {
  try {
    const mailOptions = {
      from: `${process.env.APP_NAME}`, 
      to: email, 
      subject: 'Password Reset Request',
      html: `
        <body style="margin: 0; padding: 0; background-color: #f0f0f5; font-family: 'Helvetica', sans-serif; color: #333;">
          <div style="max-width: 600px; margin: auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; padding-bottom: 30px;">
              <h1 style="font-size: 24px; color: #1d72b8; margin-bottom: 10px;"> AlloMedia</h1>
              <h2 style="font-size: 24px; color: #1d72b8; margin-bottom: 10px;">Password Reset Request</h1>
              <h2 style="font-size: 18px; font-weight: 400; color: #555;">Hello, ${name}</h2>
            </div>
            <div style="padding: 30px; background-color: #f9f9f9; border-radius: 8px; text-align: center;">
              <p style="font-size: 16px; margin-bottom: 25px; color: #666;">We received a request to reset your password. To proceed, click the button below:</p>
              <a href="${resetUrl}" style="display: inline-block; padding: 15px 30px; background-color: #1d72b8; color: #fff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 6px; transition: background-color 0.3s;">Reset Password</a>
              <p style="margin-top: 20px; font-size: 14px; color: #888;">If the button above doesn’t work, copy and paste this link into your browser:</p>
              <a href="${resetUrl}" style="word-wrap: break-word; color: #1d72b8; font-size: 14px;">${resetUrl}</a>
            </div>
            <div style="margin-top: 40px; text-align: center; font-size: 12px; color: #aaa;">
              <p>If you didn’t request a password reset, please ignore this email.</p>
              <p>Best regards,</p>
              <p>The AlloMedia Team</p>
            </div>
          </div>
        </body>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Reset password email sent to: ${email}`);
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw new Error('Error sending the email.');
  }
};



/**
 * Sends an OTP email for device verification
 * @param {string} email - The recipient's email address
 * @param {string} name - The user's name
 * @param {string} otp - The generated OTP
 */
const sendOtpEmail = async (email, name, otp) => {
  try {
    const mailOptions = {
      from: `${process.env.APP_NAME}`,
      to: email,
      subject: 'Device Verification - One Time Password (OTP)',
      html: `
        <body style="font-family: 'Arial', sans-serif; background-color: #f4f4f7; margin: 0; padding: 0; color: #333;">
          <div style="max-width: 600px; margin: auto; padding: 40px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #2F80ED; margin-bottom: 10px;">Device Verification</h1>
              <h2 style="font-weight: normal; color: #333;">Hello, ${name ? name : 'Sir'}!</h2>
            </div>
            <div style="text-align: center; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
              <p style="font-size: 16px; margin-bottom: 20px;">We detected a login attempt from a new device. Please use the following OTP to verify your device:</p>
              <p style="font-size: 24px; font-weight: bold; color: #2F80ED;">${otp}</p>
              <p style="margin-top: 20px; font-size: 14px; color: #888;">If you did not attempt this login, please secure your account.</p>
            </div>
            <div style="text-align: center; margin-top: 40px; font-size: 12px; color: #aaa;">
              <p>Best regards,</p>
              <p>The AlloMedia Team</p>
            </div>
          </div>
        </body>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to: ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Error sending the email.');
  }
};

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendOtpEmail,
};
