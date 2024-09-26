//models/userPermission.js
const mongoose = require('mongoose');

const userPermissionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    permissions: [{
        permission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Permission' 
        },
        actions: {
            type: [String], 
            enum: ['create', 'read', 'edit', 'delete'] 
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model('UserPermission', userPermissionSchema);
