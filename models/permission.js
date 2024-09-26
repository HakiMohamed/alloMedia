//models/permission.js
const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  permission_name: { type: String, required: true, unique: true },
  is_default: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Permission', permissionSchema);

