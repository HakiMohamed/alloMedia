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
  menuItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem', // Référence aux articles commandés
    required: true
  }],
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'delivered', 'canceled'],
    default: 'pending'
  },
  totalPrice: { type: Number, required: true }, // Calculé à partir des prix des articles du menu
  deliveryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery' // Référence à la livraison (si applicable)
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
