const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    console.log('1. Connecting to MongoDB Atlas...');
    // Hide password in logs for security
    const sanitizedUri = MONGODB_URI.replace(/:([^@]+)@/, ':****@');
    console.log('Connection string:', sanitizedUri);
    
    await mongoose.connect(MONGODB_URI);
    console.log('2. Connected successfully to MongoDB Atlas');

    const adminCredentials = {
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123'
    };

    // First delete any existing admin
    console.log('3. Removing existing admin if any...');
    await User.deleteOne({ email: adminCredentials.email });
    console.log('4. Existing admin removed');

    // Create new admin
    console.log('5. Creating new admin user...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);

    const admin = new User({
      name: adminCredentials.name,
      email: adminCredentials.email,
      password: hashedPassword,
      isAdmin: true
    });

    const savedAdmin = await admin.save();
    console.log('6. Admin saved to database:', {
      id: savedAdmin._id,
      email: savedAdmin.email,
      isAdmin: savedAdmin.isAdmin
    });

    // Verify the admin was created
    console.log('7. Verifying admin creation...');
    const verifyAdmin = await User.findOne({ email: adminCredentials.email });
    
    if (verifyAdmin) {
      console.log('8. Admin verified in database:', {
        id: verifyAdmin._id,
        email: verifyAdmin.email,
        isAdmin: verifyAdmin.isAdmin
      });
      console.log('\nUse these credentials to login:');
      console.log('Email:', adminCredentials.email);
      console.log('Password:', adminCredentials.password);
    } else {
      console.log('ERROR: Admin not found after creation!');
    }
    
    await mongoose.connection.close();
    console.log('9. MongoDB connection closed');
  } catch (err) {
    console.error('ERROR:', err.message);
    try {
      await mongoose.connection.close();
    } catch (closeErr) {
      console.error('Error closing MongoDB connection:', closeErr);
    }
    process.exit(1);
  }
};

console.log('=== Admin User Creation Script ===\n');
createAdmin(); 