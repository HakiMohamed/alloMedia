const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const otpController = require('../controllers/otpController');
const User = require('../models/user');
const { sendOtpEmail } = require('../services/emailService');

const app = express();
app.use(express.json());
app.post('/verify-device', otpController.verifyOtp);
app.post('/resend-otp', otpController.sendOtp);

jest.mock('../models/user');
jest.mock('../services/emailService');
jest.mock('jsonwebtoken');

describe('OTP Controller', () => {
  
  describe('POST /verify-device', () => {
    it('should verify OTP and return a token', async () => {
      const mockUser = {
        email: 'test@example.com',
        otp: '123456',
        devices: [{ userAgent: 'test-agent', isVerified: false }],
        save: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('mock-token');

      const res = await request(app)
        .post('/verify-device')
        .send({ email: 'test@example.com', otp: '123456' })
        .set('User-Agent', 'test-agent');

      expect(res.status).toBe(200);
      expect(res.body.token).toBe('mock-token');
      expect(res.body.message).toBe('Appareil vérifié avec succès');
      expect(mockUser.save).toHaveBeenCalled();
    },10000);

    it('should return 404 if the user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/verify-device')
        .send({ email: 'unknown@example.com', otp: '123456' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    },10000);

    it('should return 400 if OTP is invalid', async () => {
      const mockUser = { email: 'test@example.com', otp: '654321' };
      User.findOne.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/verify-device')
        .send({ email: 'test@example.com', otp: '123456' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('OTP invalide');
    });
  },10000);

  describe('POST /resend-otp', () => {
    it('should send OTP and return success message', async () => {
      const mockUser = {
        email: 'test@example.com',
        name: 'Test User',
        save: jest.fn().mockResolvedValue(true),
      };
      User.findOne.mockResolvedValue(mockUser);
      sendOtpEmail.mockResolvedValue(true);

      const res = await request(app)
        .post('/resend-otp')
        .send({ email: 'test@example.com' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('OTP sent successfully');
      expect(sendOtpEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Test User',
        expect.any(String)
      );
    });

    it('should return 404 if the user is not found', async () => {
      User.findOne.mockResolvedValue(null);

      const res = await request(app)
        .post('/resend-otp')
        .send({ email: 'unknown@example.com' });

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('User not found');
    },10000);
  });
},10000);
