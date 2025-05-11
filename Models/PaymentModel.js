import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
   data:{
    type:Array,required: true,
   },
   restaurantId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant',required: true }],
      userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
    cartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
    },
    orderId: {
      type: String,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'processing', 'ontheway','delivered'],
      default: 'pending',
    },
    
    confirmedAt: {
      type: Date,
    },
    
  },
  
  { timestamps: true }
);

export const Payment = mongoose.model('Payment', paymentSchema);
