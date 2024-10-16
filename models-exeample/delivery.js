const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order', // Référence à la commande
    required: true
  },
  deliveryPersonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Référence au livreur
    required: true
  },
  status: {
    type: String,
    enum: ['accepted', 'picked_up', 'delivered', 'failed'],
    default: 'accepted'
  }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
