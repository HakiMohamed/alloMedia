const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role_name: { 
    type: String, 
    required: true, 
    unique: true // Nom unique du rôle (ex : client, livreur, manager)
  },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission' // Permissions spécifiques associées à ce rôle
  }]
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);
