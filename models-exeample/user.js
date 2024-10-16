const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String }, 
  profilePicture: {type: String},
  profileCover: {type: String},
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
      userAgent: String,
      isVerified: { type: Boolean, default: false },
      LastloginAt: { type: Date, default: Date.now }
    }
  ],
  orders: [{ // Ajouter les commandes pour chaque utilisateur
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],
  deliveries: [{ // Ajouter les livraisons effectuées (pour les livreurs)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery'
  }],
}, 
{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
