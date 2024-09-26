//models/role.js
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  role_name: { type: String, required: true, unique: true },
  permissions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Permission'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Role', roleSchema);

