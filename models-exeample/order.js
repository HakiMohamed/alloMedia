const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au client qui passe la commande
    required: true
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant', // Référence au restaurant où la commande est passée
    required: true
  },
  items: [{
    menuItem: { type: Schema.Types.ObjectId, ref: 'MenuItem' },
    quantity: { type: Number, required: true }
  }],
  status: {
    type: String,
    status: { type: String, enum: ['pending', 'accepted', 'preparing', 'readyForPickup', 'pickedUp', 'delivered', 'cancelled'], default: 'pending' },
    default: 'pending'
  },
  totalPrice: { type: Number, required: true }, // Calculé à partir des prix des articles du menu
  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery' // Référence à la livraison (si applicable)
  },

  ConfirmedSecret:{ type: String }, // like Otp For livraison confirmation 

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
