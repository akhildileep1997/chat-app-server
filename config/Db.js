import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.Mongo_url);
    console.log("Database connection established successfully");
  } catch(error) {
    console.error("Database connection failed:",error);
  }
};

export default connectDb;
