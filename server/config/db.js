const mongoose = require('mongoose');
const config = require('config');

const connectDB = async () => {
  try {
    const mongoURI = config.get('mongoURI');
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('MongoDB Connected Successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB; 