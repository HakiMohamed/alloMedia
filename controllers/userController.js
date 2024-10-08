const User = require('../models/user');
const Role = require('../models/role');
const Permission = require('../models/permission');  // Modèle des permissions


// Assign roles to a user
const assignRolesToUser = async (req, res) => {
  const { userId, roles } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Assign roles to the user
    const foundRoles = await Role.find({ _id: { $in: roles } });
    user.roles = foundRoles.map(role => role._id); // Replace roles with the provided ones

    await user.save();
    return res.status(200).json({ message: 'Roles assigned to user', user });
  } catch (error) {
    console.error('Error assigning roles to user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


const assignPermissionToUser = async (req, res) => {
    try {
      const { userId, permissionId } = req.body;
  
      // Vérifier si l'utilisateur existe
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Vérifier si la permission existe
      const permission = await Permission.findById(permissionId);
      if (!permission) {
        return res.status(404).json({ message: 'Permission not found' });
      }
  
      // Ajouter la permission à la liste des permissions de l'utilisateur (éviter les doublons)
      if (!user.permissions.includes(permissionId)) {
        user.permissions.push(permissionId);
      }
  
      // Sauvegarder les modifications
      await user.save();
  
      return res.status(200).json({ 
        message: 'Permission assigned to user successfully', 
        user 
      });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  };

module.exports = {
  assignPermissionToUser,
  assignRolesToUser,
};
