import mongoose from "mongoose";

// Define the user schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    address:{
      type:String,
      required:true
    },
    phonenumber:{
      type:Number,
      unique: true,
      required:true
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
