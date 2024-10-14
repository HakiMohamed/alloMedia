const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from app.js
const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { sendVerificationEmail, sendOtpEmail, sendResetPasswordEmail } = require('../services/emailService');

jest.mock('../services/emailService');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('AlloMedia API Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  describe('AuthController', () => {
    describe('POST /api/register', () => {
      it('should register a new user successfully', async () => {
        const userData = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          phoneNumber: '1234567890',
          roles: ['user']
        };

        bcrypt.hash.mockResolvedValue('hashedPassword');
        jwt.sign.mockReturnValue('mockToken');

        const response = await request(app)
          .post('/api/register')
          .send(userData)
          .set('User-Agent', 'test-agent');

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toContain('Congratulations!, you registered successfully');
        expect(response.body.user).toHaveProperty('email', userData.email);
        expect(response.body).toHaveProperty('token');
        expect(sendVerificationEmail).toHaveBeenCalled();
      });

      it('should return 400 if email is already in use', async () => {
        await User.create({
          name: 'Existing User',
          email: 'existing@example.com',
          password: 'hashedPassword'
        });

        const response = await request(app)
          .post('/api/register')
          .send({
            name: 'New User',
            email: 'existing@example.com',
            password: 'password123'
          });

        expect(response.statusCode).toBe(400);
        expect(response.body.errors[0].msg).toBe('Email already in use');
      });

      // Add more test cases for validation errors
    });

    describe('POST /api/login', () => {
      it('should login successfully with verified device', async () => {
        const user = await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: await bcrypt.hash('password123', 10),
          isVerified: true,
          devices: [{ userAgent: 'test-agent', isVerified: true }]
        });

        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mockToken');

        const response = await request(app)
          .post('/api/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          })
          .set('User-Agent', 'test-agent');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Logged in successfully');
        expect(response.body).toHaveProperty('token');
        expect(response.body.user).toHaveProperty('email', 'test@example.com');
      });

      it('should require OTP for new device', async () => {
        await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: await bcrypt.hash('password123', 10),
          isVerified: true,
          devices: []
        });

        bcrypt.compare.mockResolvedValue(true);

        const response = await request(app)
          .post('/api/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          })
          .set('User-Agent', 'new-device-agent');

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('New device detected. Please verify OTP.');
        expect(sendOtpEmail).toHaveBeenCalled();
      });

      // Add more test cases for invalid credentials, unverified user, etc.
    });
  });

  describe('EmailController', () => {
    describe('POST /api/resend-verification', () => {
      it('should resend verification email', async () => {
        const user = await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword',
          isVerified: false
        });

        jwt.sign.mockReturnValue('mockToken');

        const response = await request(app)
          .post('/api/resend-verification')
          .send({ email: 'test@example.com' });

        expect(response.statusCode).toBe(200);
        expect(sendVerificationEmail).toHaveBeenCalledWith('test@example.com', 'Test User', expect.any(String));
      });

      // Add more test cases for non-existent user, already verified user, etc.
    });

    describe('GET /api/verify-email', () => {
      it('should verify email successfully', async () => {
        const user = await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword',
          isVerified: false
        });

        jwt.verify.mockReturnValue({ id: user._id });

        const response = await request(app)
          .get('/api/verify-email')
          .query({ token: 'validToken' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Email verified successfully.');

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.isVerified).toBe(true);
      });

      // Add more test cases for invalid token, expired token, etc.
    });
  });

  describe('OtpController', () => {
    describe('POST /api/verify-otp', () => {
      it('should verify OTP successfully', async () => {
        const user = await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword',
          otp: '123456',
          devices: [{ userAgent: 'test-agent', isVerified: false }]
        });

        jwt.sign.mockReturnValue('mockToken');

        const response = await request(app)
          .post('/api/verify-otp')
          .send({
            email: 'test@example.com',
            otp: '123456'
          })
          .set('User-Agent', 'test-agent');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Appareil vérifié avec succès');
        expect(response.body).toHaveProperty('token');

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.devices[0].isVerified).toBe(true);
        expect(updatedUser.otp).toBeUndefined();
      });

      // Add more test cases for invalid OTP, non-existent user, etc.
    });

    describe('POST /api/send-otp', () => {
      it('should send OTP successfully', async () => {
        await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword'
        });

        const response = await request(app)
          .post('/api/send-otp')
          .send({ email: 'test@example.com' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('OTP sent successfully');
        expect(sendOtpEmail).toHaveBeenCalled();
      });

      // Add more test cases for non-existent user, etc.
    });
  });

  describe('ResetPasswordController', () => {
    describe('POST /api/request-password-reset', () => {
      it('should send password reset email', async () => {
        await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashedPassword'
        });

        jwt.sign.mockReturnValue('mockToken');

        const response = await request(app)
          .post('/api/request-password-reset')
          .send({ email: 'test@example.com' });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Password reset email has been sent.');
        expect(sendResetPasswordEmail).toHaveBeenCalled();
      });

      // Add more test cases for non-existent user, etc.
    });

    describe('POST /api/reset-password', () => {
      it('should reset password successfully', async () => {
        const user = await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: 'oldHashedPassword'
        });

        jwt.verify.mockReturnValue({ id: user._id });
        bcrypt.hash.mockResolvedValue('newHashedPassword');

        const response = await request(app)
          .post('/api/reset-password')
          .send({
            token: 'validToken',
            newPassword: 'newPassword123'
          });

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Password has been reset successfully.');

        const updatedUser = await User.findById(user._id);
        expect(updatedUser.password).toBe('newHashedPassword');
      });

      // Add more test cases for invalid token, expired token, etc.
    });
  });
});