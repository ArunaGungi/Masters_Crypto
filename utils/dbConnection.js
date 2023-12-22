// dbConnection.js
const mongoose = require('mongoose');
require('dotenv').config();

async function connectToMongoDB() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('DATABASE_URL not found in the environment variables');
    process.exit(1);
  }

  try {
    await mongoose.connect(databaseUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectToMongoDB;
