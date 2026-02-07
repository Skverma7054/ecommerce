const mongoose = require("mongoose");

// Connects to MongoDB using the connection string from environment variables.
// Keeping DB logic isolated makes it easier to reuse in tests or other entry points.
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not set in environment variables");
  }

  await mongoose.connect(mongoUri);
  console.log("MongoDB connected");
};

module.exports = connectDB;
