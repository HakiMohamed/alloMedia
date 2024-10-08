const Permission = require('../models/permission');

// Add a new permission
const addPermission = async (req, res) => {
  const { permission_name } = req.body;

  try {
    // Create a new permission
    const permission = new Permission({ permission_name });
    await permission.save();

    return res.status(201).json({ message: 'Permission created successfully', permission });
  } catch (error) {
    console.error('Error creating permission:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addPermission,
};
