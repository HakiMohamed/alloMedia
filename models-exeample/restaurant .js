const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true // Nom du restaurant
  },
  address: { 
    type: String, 
    required: true // Adresse complète du restaurant
  },
  logo: { 
    type: String // URL du logo du restaurant
  },
  cover: { 
    type: String // Image de couverture (bannière) du restaurant
  },
  pictures: [{ 
    type: String // Liste d'URL des images supplémentaires du restaurant
  }],
  manager: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Référence au manager qui gère ce restaurant
  },
  menuItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem' // Liste des articles de menu associés au restaurant
  }],
  location: {
    type: { 
      type: String, 
      default: 'Point' // Type de coordonnées géographiques
    },
    coordinates: [Number] // Coordonnées (longitude, latitude) pour la localisation
  },
  category: { 
    type: String, 
    required: true // Catégorie du restaurant (ex : "Pizzeria", "Chinois")
  },
  cuisineType: { 
    type: String, 
    required: true // Type de cuisine proposé (ex : "Italien", "Français")
  },
}, { timestamps: true });

restaurantSchema.index({ location: '2dsphere' }); // Index géographique pour les recherches par localisation
restaurantSchema.index({ name: 'text', cuisineType: 'text', category: 'text' }); // Index textuel pour la recherche par nom, type de cuisine et catégorie

module.exports = mongoose.model('Restaurant', restaurantSchema);
