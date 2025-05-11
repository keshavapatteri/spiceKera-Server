import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
   
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    Product: [
      {
        ProductId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        pricePerDay: {
          type: Number,
          required: true,
        },
        totalCost: {
          type: Number,
          required: true,
        },
        restaurantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Restaurant",
          // required: [true, "Restaurant ID is required"],
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);


const Cart = mongoose.model("Cart", CartSchema);
export default Cart;
