const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  Pictures: [{ type: String }],
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant', // Référence au restaurant qui sert cet article
    required: true
  },
  category: { type: String, required: true },

  isAvailable: { type: Boolean, default: true }

}, { timestamps: true });

menuItemSchema.index({ name: 'text', category: 'text' });


module.exports = mongoose.model('MenuItem', menuItemSchema);
