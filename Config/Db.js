import mongoose from "mongoose";

const connectdb = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://mktkid2023:mktkid@user.q7vks.mongodb.net/user",
      
    );
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

export default connectdb;




