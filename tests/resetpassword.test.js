jest.setTimeout(10000); 

const request = require('supertest');   
const app = require('../app');
const User = require('../models/user');
const { sendResetPasswordEmail } = require('../services/emailService');
const jwt = require('jsonwebtoken');

jest.mock('../models/user');
jest.mock('../services/emailService');

describe('Reset Password Controller', () => {
 

  describe('resetPassword', () => {
    it('should return 400 if token is not provided', async () => {
      const response = await request(app)
        .post('/api/reset-password')
        .send({ newPassword: 'newPassword123' });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Token is required.');
    });

    it('should return 404 if user not found', async () => {
      const token = jwt.sign({ id: 'userId' }, process.env.JWT_SECRET);
      jwt.verify = jest.fn().mockReturnValue({ id: 'userId' });
      User.findOne.mockResolvedValue(null); 

      const response = await request(app)
        .post('/api/reset-password')
        .send({ newPassword: 'newPassword123', token });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found.');
    });

    it('should reset the password successfully', async () => {
      const user = { _id: 'userId', password: 'oldPassword123', save: jest.fn() };
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      jwt.verify = jest.fn().mockReturnValue({ id: user._id });
      User.findOne.mockResolvedValue(user);

      const response = await request(app)
        .post('/api/reset-password')
        .send({ newPassword: 'newPassword123', token });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Password has been reset successfully.');
      expect(user.password).not.toBe('oldPassword123');
      expect(user.save).toHaveBeenCalled();
    });

   

    
  });
});
