const mongoose = require('mongoose');
const { Schema } = mongoose;

const logSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true // Référence à l'utilisateur qui a effectué l'action
  },
  action: { 
    type: String, //  l'action 
    required: true, 
  },
  description: { 
    type: String // Description détaillée de l'action (facultatif)
  },
  ipAddress: { 
    type: String, 
    validate: {
      validator: function(v) {
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(v);
      },
      message: props => `${props.value} is not a valid IP address!`
    }, // Validation de l'adresse IP pour s'assurer qu'elle est correcte
  },
  devices: {
    userAgent: String // Informations sur le dispositif (navigateur, OS, etc.)
  }
}, { timestamps: true });

module.exports = mongoose.model('Log', logSchema);
