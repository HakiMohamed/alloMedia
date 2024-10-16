const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  logo : {type: String},
  cover : {type: String},
  pictures : [{type: String}],
  manager: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Le manager est un utilisateur
    required: true
  },  
  menuItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem' // Référence aux articles du menu
  }],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number]
  },
  category: { type: String, required: true },
  cuisineType: { type: String, required: true },

}, { timestamps: true });

restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ name: 'text', cuisineType: 'text', category: 'text' });


module.exports = mongoose.model('Restaurant', restaurantSchema);
