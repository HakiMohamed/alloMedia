//C:\Users\Youcode\Desktop\AlloMedia\seeders\adminSeeder.js
const mongoose = require('mongoose');
const User = require('../models/user'); 
const Role = require('../models/role'); 
const Permission = require('../models/permission');  
const bcrypt = require('bcryptjs');
require('dotenv').config();


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    seedAdmin();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });


const seedAdmin = async () => {
    try {
      console.log('Seeder started...');
  
      let adminRole = await Role.findOne({ role_name: 'admin' });
      console.log('Checking if admin role exists...');
  
      if (!adminRole) {
        adminRole = new Role({ role_name: 'admin' });
        await adminRole.save();
        console.log('Admin role created successfully.');
      } else {
        console.log('Admin role already exists.');
      }
  
      const permissions = ['create_user', 'update_user', 'delete_user', 'view_users'];
      console.log('Permissions to be checked:', permissions);
  
      let foundPermissions = await Permission.find({ permission_name: { $in: permissions } });
      console.log('Found permissions:', foundPermissions.map(p => p.permission_name));
  
      for (const perm of permissions) {
        if (!foundPermissions.some(p => p.permission_name === perm)) {
          const newPermission = new Permission({ permission_name: perm });
          await newPermission.save();
          console.log('Permission created:', perm);
          foundPermissions.push(newPermission);
        } else {
          console.log('Permission already exists:', perm);
        }
      }
  
      adminRole.permissions = foundPermissions.map(perm => perm._id);
      await adminRole.save();
      console.log('Permissions assigned to admin role.');
  
      const existingAdmin = await User.findOne({ email: 'mohamedhaki70@gmail.com' });
      console.log('Checking if admin user exists...');
  
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('adminpassword', 10); 
  
        const adminUser = new User({
          name: 'Admin User',
          email: 'mohamedhaki70@gmail.com',
          phoneNumber: '0641725930',
          password: hashedPassword,
          roles: [adminRole._id], 
          permissions: adminRole.permissions, 
          isVerified: true 
        });
  
        await adminUser.save();
        console.log('Admin user created successfully.');
      } else {
        console.log('Admin user already exists.');
      }
  
    } catch (error) {
      console.error('Error seeding admin:', error);
    } finally {
      mongoose.connection.close();
    }
  };
  

module.exports = seedAdmin;
