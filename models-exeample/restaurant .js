const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  manager: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Le manager est un utilisateur
    required: true
  },
  menuItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem' // Référence aux articles du menu
  }]
}, { timestamps: true });

module.exports = mongoose.model('Restaurant', restaurantSchema);
