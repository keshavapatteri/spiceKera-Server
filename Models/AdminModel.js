import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema(
  {
email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    // minlength: 6,
  },
  
}
);

const Admin = mongoose.model("Admin", AdminSchema);
export default Admin;
