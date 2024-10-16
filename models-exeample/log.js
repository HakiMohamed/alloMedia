const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à l'utilisateur
  action: { type: String, required: true }, // Action effectuée (ex: "connexion", "modification profil")
  description: { type: String }, // Détails supplémentaires (ex: "modification du mot de passe")
  ipAddress: { type: String }, // Adresse IP de l'utilisateur (facultatif)
  devices:{
      userAgent: String,
    },
}, 
{ timestamps: true });
  


module.exports = mongoose.model('Log', logSchema);
