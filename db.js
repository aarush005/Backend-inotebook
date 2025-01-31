const mongoose = require('mongoose');

const mongoURI = "mongodb://localhost:27017/inotebook"; // Add a database name

async function connectToMongo() {
  try {
    console.log("Attempting to connect to MongoDB...");
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("Connected to MongoDB successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
}

module.exports = connectToMongo;
