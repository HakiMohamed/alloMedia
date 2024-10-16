const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Order', 
    required: true // Référence à la commande associée à cette livraison
  },
  deliveryPersonId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Référence au livreur en charge de cette livraison
  },
  deliveryStatus: { 
    type: String, 
    enum: ['assigned', 'pickedUp', 'inTransit', 'delivered', 'failed'], 
    default: 'assigned' // Statut de la livraison
  },
  pickupTime: { 
    type: Date // Heure à laquelle la commande a été récupérée pour livraison
  },
  deliveryTime: { 
    type: Date // Heure à laquelle la commande a été livrée
  },
  pickupAddress: { 
    type: String, 
    required: true // Adresse de collecte (le restaurant)
  },
  deliveryAddress: { 
    type: String, 
    required: true // Adresse de livraison (client)
  },
  deliveryFee: { 
    type: Number // Frais de livraison (si applicable)
  }
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
