
const mongoose = require("mongoose");
// require("dotenv").config();

// const dns = require("dns");
// dns.setServers(["1.1.1.1", "8.8.8.8"]);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000
    });

    console.log("MongoDB Connected Successfully!");
  } catch (error) {
    console.error("MongoDB Connection Failed:");
    console.error("Error Name:", error.name);
    console.error("Error Code:", error.code);
    console.error("Error Message:", error.message);

    throw error;
  }
};

module.exports = connectDB;

