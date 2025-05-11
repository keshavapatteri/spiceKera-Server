import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  cartId: {
    type:String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  street:{
type:String,

  },
  // restaurantId: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "Restaurant",
  //         // required: [true, "Restaurant ID is required"],
  //       },
  restaurantId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }],
  cartId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart', // 👈 this must match your Cart model name
  },
  

  city: String,
  state: String,
  postalCode: String,
  phoneNumber:String,
}, { timestamps: true });


const Address = mongoose.model("Address", addressSchema);
export default Address;