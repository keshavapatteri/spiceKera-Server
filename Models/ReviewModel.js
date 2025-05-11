// import mongoose from "mongoose";

// const ReviewSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     orderId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "Order",  // Make sure you have an Order model
//     },
//     username: {
//       type: String,
//       required: true,
//     },
//     reviewText: {
//       type: String,
//       required: true,
//     },
//     rating: {
//       type: Number,
//       required: true,
//       min: 1,
//       max: 5,
//     },
//     reviewDate: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   { timestamps: true }
// );

// const Review = mongoose.model("Review", ReviewSchema);
// export default Review;
import mongoose from "mongoose";

// Define the Review Schema
const ReviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the User model
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order", // Reference to the Order model
    },
    name: {
      type: String,
    
    },
    reviewText: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,  // Rating cannot be lower than 1
      max: 5,  // Rating cannot be higher than 5
    },
    reviewDate: {
      type: Date,
      default: Date.now, // Set default date to now if not provided
    },
  //    restaurantId: {
  //         type: mongoose.Schema.Types.ObjectId,
  //         ref: "Restaurant",
  //         required: [true, "Restaurant ID is required"],
  //       },
  //        ProductId: {
  //                 type: mongoose.Schema.Types.ObjectId,
  //                 ref: "Product",
  //                 required: true,
  //               },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the Review model
const Review = mongoose.model("Review", ReviewSchema);

// Export the Review model
export default Review;
