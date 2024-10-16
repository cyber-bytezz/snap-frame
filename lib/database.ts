import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log("Already connected to MongoDB");
      return mongoose.connection;  // MongoDB is already connected
    }

    await mongoose.connect(process.env.DATABASE_URL!, {
      dbName: "collagebackend", // Replace with your database name
    });
    
    console.log("Successfully connected to MongoDB");  // Log success message
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);  // Log error to terminal
    throw new Error("Failed to connect to MongoDB");
  }
};
