const request = require('supertest');
const app = require('../app'); 
const User = require('../models/user'); 
const mongoose = require('mongoose');

describe('Authentication Tests', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /api/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(201); 
      expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should not register a user with an existing email', async () => {
      await request(app)
        .post('/api/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/register')
        .send({
          name: 'John Smith',
          email: 'jane@example.com',
          password: 'password456',
        });

      expect(res.statusCode).toEqual(400); 
      expect(res.body.errors[0]).toHaveProperty('msg', 'Email already in use');
    });

    it('should return validation errors if inputs are invalid', async () => {
      const res = await request(app)
        .post('/api/register')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123',
        });

      expect(res.statusCode).toEqual(400); 
      expect(res.body.errors).toHaveLength(3); 
    });
  });

  describe('POST /api/login', () => {
    it('should login a user with valid credentials', async () => {
      await request(app)
        .post('/api/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'jane@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(200); 
      expect(res.body).toHaveProperty('token'); 
    });

    it('should not login a user with incorrect password', async () => {
      await request(app)
        .post('/api/register')
        .send({
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
        });

      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'jane@example.com',
          password: 'wrongpassword',
        });

      expect(res.statusCode).toEqual(401); 
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return an error for non-existing user', async () => {
      const res = await request(app)
        .post('/api/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(res.statusCode).toEqual(401); 
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
});
