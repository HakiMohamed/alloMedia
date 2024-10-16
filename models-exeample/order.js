const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  clientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Référence à l'utilisateur qui a passé la commande
  },
  restaurantId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true // Référence au restaurant où la commande est passée
  },
  items: [{
    menuItem: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'MenuItem' // Référence à l'article de menu commandé
    },
    quantity: { 
      type: Number, 
      required: true // Quantité de cet article commandé
    }
  }],
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'preparing', 'readyForPickup', 'pickedUp', 'delivered', 'cancelled'], 
    default: 'pending' // Statut actuel de la commande
  },
  totalPrice: { 
    type: Number, 
    required: true // Prix total de la commande
  },
  deliveryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Delivery' // Référence à la livraison associée (si applicable)
  },
  confirmedSecret: { 
    type: String // Code de confirmation pour valider que client a bien recupirer leur demande
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
