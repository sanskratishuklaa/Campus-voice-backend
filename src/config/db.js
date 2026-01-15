const mongoose = require('mongoose');

let isDBConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isDBConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isDBConnected = false;
    console.warn(`⚠️  MongoDB connection error: ${error.message}`);
    console.warn(`⚠️  Backend will continue running without database.`);
    return false;
  }
};

const getDBStatus = () => isDBConnected;

const setDBConnected = (status) => {
  isDBConnected = status;
};

module.exports = { connectDB, getDBStatus, setDBConnected };
