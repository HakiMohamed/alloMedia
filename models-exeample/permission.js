const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  permission_name: { 
    type: String, 
    required: true, 
    unique: true // Nom unique de la permission (ex : "create_order", "manage_restaurant")
  },
  is_default: { 
    type: Boolean, 
    default: false // Indique si cette permission est assignée par défaut à tous les utilisateurs
  }
}, { timestamps: true });

module.exports = mongoose.model('Permission', permissionSchema);
