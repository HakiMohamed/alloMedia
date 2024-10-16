const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true // Nom complet de l'utilisateur, obligatoire
  },
  email: { 
    type: String, 
    required: true, 
    unique: true // Adresse email unique pour chaque utilisateur
  },
  password: { 
    type: String, 
    required: true // Mot de passe pour l'authentification
  },
  phoneNumber: { 
    type: String // Numéro de téléphone facultatif
  },
  profilePicture: { 
    type: String // URL de l'image de profil de l'utilisateur
  },
  profileCover: { 
    type: String // Image de couverture (bannière) de profil
  },
  otp: { 
    type: String // Code OTP pour l'authentification à deux facteurs (2FA)
  },
  roles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Role' // Référence aux rôles (client, manager, livreur, etc.)
  }],
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission' // Permissions supplémentaires attribuées à l'utilisateur
  }],
  isVerified: { 
    type: Boolean, 
    default: false // Vérifie si l'utilisateur a confirmé son email ou OTP
  },
  devices: [ 
    {
      userAgent: String, // Informations sur le navigateur ou appareil utilisé pour se connecter
      isVerified: { 
        type: Boolean, 
        default: false // Vérifie si le dispositif est approuvé pour l'utilisateur
      },
      lastLoginAt: { 
        type: Date, 
        default: Date.now // Date du dernier login
      }
    }
  ],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order' // Référence aux commandes passées par l'utilisateur (client)
  }],
  deliveries: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Delivery' // Référence aux livraisons effectuées (pour les livreurs)
  }],
}, { timestamps: true }); // Ajoute automatiquement les champs createdAt et updatedAt

module.exports = mongoose.model('User', userSchema);
