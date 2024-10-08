const Role = require('../models/role');
const Permission = require('../models/permission');

// Add a new role
const addRole = async (req, res) => {
  const { role_name, permissions } = req.body;

  try {
    // Create a new role
    const role = new Role({ role_name });

    // If permissions are provided, add them to the role
    if (permissions && permissions.length > 0) {
      const foundPermissions = await Permission.find({ _id: { $in: permissions } });
      role.permissions = foundPermissions.map(perm => perm._id); // Attach permissions
    }

    await role.save();
    return res.status(201).json({ message: 'Role created successfully', role });
  } catch (error) {
    console.error('Error creating role:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Assign permissions to a role
const assignPermissionsToRole = async (req, res) => {
  const { roleId, permissions } = req.body;

  try {
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }

    // Add the new permissions to the role
    const foundPermissions = await Permission.find({ _id: { $in: permissions } });
    role.permissions = foundPermissions.map(perm => perm._id); // Replace existing permissions

    await role.save();
    return res.status(200).json({ message: 'Permissions assigned to role', role });
  } catch (error) {
    console.error('Error assigning permissions:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addRole,
  assignPermissionsToRole,
};
