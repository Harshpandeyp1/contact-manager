const mongoose = require("mongoose");

const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || process.env.Mongo_uri;

  if (!mongoURI) {
    console.error("MongoDB URI is missing. Add MONGO_URI in your .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB not connected:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;