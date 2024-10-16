const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant', // Référence au restaurant qui sert cet article
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
