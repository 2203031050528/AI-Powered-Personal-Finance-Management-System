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

    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const adminCredentials = {
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'admin123'
    };

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminCredentials.password, salt);

    const admin = new User({
      name: adminCredentials.name,
      email: adminCredentials.email,
      password: hashedPassword,
      isAdmin: true
    });

    await admin.save();
    console.log('\nAdmin created successfully!');
    console.log('Use these credentials to login:');
    console.log('Email:', adminCredentials.email);
    console.log('Password:', adminCredentials.password);
    
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error:', err.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

createAdmin(); 