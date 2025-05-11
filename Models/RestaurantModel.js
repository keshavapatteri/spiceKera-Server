import mongoose from "mongoose";
const RestaurantSchema = new mongoose.Schema(
  {
    restaurantname: {
      type: String,
      required: [true, "name is required"]
    },
    address: {
      type: String,
      required: [true, "address is required"]
    },
    workingtime: {
      type: String,
      required: [true, "workingtime is required"]
    },
    phonenumber: {
      type: Number,
      required: [true, "Number is required"]
    },
// restaurantId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Restaurant",
//       //required: [true, "Restaurant ID is required"],
//     },

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

  }
);

const Restaurant = mongoose.model("Restaurant", RestaurantSchema);
export default Restaurant;
