const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true // Nom de l'article de menu
  },
  description: { 
    type: String // Description de l'article
  },
  price: { 
    type: Number, 
    required: true // Prix de l'article
  },
  pictures: [{ 
    type: String // URL(s) des images de l'article
  }],
  restaurant: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Restaurant', 
    required: true // Référence au restaurant qui propose cet article
  },
  category: { 
    type: String, 
    required: true // Catégorie de l'article (ex : "Plat principal", "Boisson")
  },
  isAvailable: { 
    type: Boolean, 
    default: true // Indique si l'article est disponible à la commande
  }
}, { timestamps: true });

menuItemSchema.index({ name: 'text', category: 'text' }); // Index textuel pour la recherche

module.exports = mongoose.model('MenuItem', menuItemSchema);
