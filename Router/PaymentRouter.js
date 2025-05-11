import express from 'express'
import { getAllOrders, processPayment, verifyRazorpay } from '../Controller/PaymentController.js';
import { verifyUserToken } from '../Middleware/AuthMiddleware.js';



const PaymentRouter = express.Router();

PaymentRouter.post("/create",verifyUserToken,processPayment);   
PaymentRouter.post('/verifyRazorpay',verifyRazorpay);

PaymentRouter.get('/orders',verifyUserToken,getAllOrders);  ///,
export default PaymentRouter; 
