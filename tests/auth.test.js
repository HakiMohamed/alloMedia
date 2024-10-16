const request = require('supertest');
const app = require('../app'); 
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


      it('should return 400 for invalid email format during registration', async () => {
        const userData = {
          name: 'Test User',
          email: 'invalid-email-format',
          password: 'password123',
          phoneNumber: '1234567890',
        };
      
        const response = await request(app)
          .post('/api/register')
          .send(userData);
      
        expect(response.statusCode).toBe(400);
        expect(response.body.errors[0].msg).toBe('Invalid email');
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

      it('should return 401 for invalid credentials', async () => {
        await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: await bcrypt.hash('password123', 10),
          isVerified: true
        });

        bcrypt.compare.mockResolvedValue(false);

        const response = await request(app)
          .post('/api/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword'
          });

        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
      });

      it('should handle unverified user', async () => {
        await User.create({
          name: 'Test User',
          email: 'test@example.com',
          password: await bcrypt.hash('password123', 10),
          isVerified: false
        });

        bcrypt.compare.mockResolvedValue(true);

        const response = await request(app)
          .post('/api/login')
          .send({
            email: 'test@example.com',
            password: 'password123'
          });

        expect(response.statusCode).toBe(403);
        expect(response.body.message).toBe('User not verified. Please verify your email.');
        expect(sendVerificationEmail).toHaveBeenCalled();
      });
    });
  },10000);

 

  

 
});