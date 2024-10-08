const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },  
  phoneNumber: { type: String, unique: true, sparse: true }, 
  otp: { type: String }, 
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role'
  }],
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }],
  isVerified: { type: Boolean, default: false },
  devices: [
    {
      ipAddress: String,  
      userAgent: String,
      isVerified: { type: Boolean, default: false },
      loginAt: { type: Date, default: Date.now }
    }
  ],
}, 
{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
