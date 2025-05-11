import Razorpay from 'razorpay';
import nodemailer from 'nodemailer';
import { Payment } from '../Models/PaymentModel.js';
import Cart from '../Models/CartModel.js';

const razorpayInstance = new Razorpay({
  key_id: 'rzp_test_Yh0fPwTheqXsx5',
  key_secret: 'yWdy6YEhYSQnoetu0ISm2dDV',

});

//latest proc

export const processPayment = async (req, res) => {
  try {
    const { cartId, data } = req.body;
    const userId = req.user.id;

    if (!cartId) {
      return res.status(400).json({ message: 'Cart ID is required' });
    }

    // Find cart and populate restaurantId
    const cart = await Cart.findById(cartId).populate('Product.restaurantId');

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const amount = cart.totalPrice;

    // Create Razorpay order
    
    const options = {
      amount: amount * 100, // should be a number in paise (not string)
      currency: 'INR',
      receipt: `receipt_${cartId}`,
      notes: { cartId },
    };
   
    
    
    const order = await razorpayInstance.orders.create(options);

    // Extract unique restaurant IDs from products
    const restaurantIds = [
      ...new Set(
        cart.Product.map(item => item?.restaurantId?._id?.toString()).filter(Boolean)
      ),
    ];

    // Create and save payment entry
    const payment = new Payment({
      userId,
      cartId,
      orderId: order.id,
      totalCost: amount,
      paymentStatus: 'pending',
      restaurantId: restaurantIds,
      data, // any additional data from frontend
    });

    await payment.save();

    // Return order details to frontend
    res.status(201).json({
      success: true,
      order,
      cartId,
      paymentId: payment._id,
      restaurantId: restaurantIds,
    });

  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create payment order', error: error.message });
  }
};




const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: process.env.EMAIL_USER, // e.g., 'youremail@gmail.com'
    pass: process.env.EMAIL_PASS, // use app password if 2FA is enabled
  },
});

export const verifyRazorpay = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    console.log(`hhhh`, req.body);

    if (!razorpay_order_id) {
      return res.status(400).json({ success: false, message: 'Order ID is required for verification' });
    }

    const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

    if (orderInfo.status === 'paid' || orderInfo.status === 'created') {
      const updatedPayment = await Payment.findOneAndUpdate(
        { orderId: razorpay_order_id },
        {
          paymentStatus: 'paid',
          confirmedAt: new Date(),
        },
        { new: true }
      )
        .populate('userId')         
        .populate('restaurantId');  

      console.log(`update`, updatedPayment.restaurantId);

      if (!updatedPayment) {
        return res.status(404).json({ success: false, message: 'Payment record not found in database' });
      }

      if (!updatedPayment.userId?.email) {
        return res.status(400).json({
          success: false,
          message: 'User email not found',
        });
      }

      const restaurantEmail = updatedPayment.restaurantId?.[0]?.email; // If it's an array
      if (!restaurantEmail) {
        return res.status(400).json({
          success: false,
          message: 'Restaurant email not found',
        });
      }

      const userName = updatedPayment.userId.name || 'User';
      const restaurantName = updatedPayment.restaurantId?.[0]?.name || 'Restaurant'; // Assuming it's the first item in the array
      const confirmedAtFormatted = updatedPayment.confirmedAt.toLocaleString();

      // =========================
      // ✅ 1. Email to USER
      // =========================
      const userMailOptions = {
        from: process.env.EMAIL_USER,
        to: updatedPayment.userId.email,
        subject: 'Payment Confirmation - Razorpay',
        html: `
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
            body { font-family: 'Poppins', sans-serif; color: #4a4a4a; max-width: 600px; margin: auto; background-color: #f8f9fa; padding: 0; }
            .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); margin: 20px auto; }
            .header { background: linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-weight: 600; font-size: 24px; }
            .content { padding: 30px; }
            .thank-you { font-size: 22px; font-weight: 600; color: #6a1b9a; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
            .thank-you:before { content: "✓"; display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; background: #e1bee7; border-radius: 50%; font-size: 18px; }
            .intro-text { font-size: 15px; line-height: 1.6; margin-bottom: 25px; }
            .order-details { border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin: 25px 0; }
            .detail-row { display: flex; margin-bottom: 12px; align-items: center; }
            .label { font-weight: 500; width: 120px; color: #757575; font-size: 14px; }
            .value { font-weight: 500; color: #212121; }
            .highlight { color: #6a1b9a; font-weight: 600; }
            .divider { height: 1px; background: linear-gradient(to right, transparent, #e0e0e0, transparent); margin: 20px 0; }
            .support-text { font-size: 14px; color: #616161; margin: 25px 0 15px; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #9e9e9e; }
            .badge { display: inline-block; background: #e1bee7; color: #6a1b9a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; margin-left: 8px; }
          </style>
          <div class="container">
            <div class="header">
              <h1>Payment Successful!</h1>
            </div>
            <div class="content">
              <div class="thank-you">Thank you, ${userName}!</div>
              <p class="intro-text">Your payment has been confirmed and your order is being processed. Here's your order summary:</p>
              
              <div class="order-details">
                <div class="detail-row">
                  <span class="label">Order ID</span>
                  <span class="value highlight">${razorpay_order_id}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Amount Paid</span>
                  <span class="value highlight">₹${updatedPayment.totalCost}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status</span>
                  <span class="value">${updatedPayment.paymentStatus} <span class="badge">Confirmed</span></span>
                </div>
                <div class="detail-row">
                  <span class="label">Date & Time</span>
                  <span class="value">${confirmedAtFormatted}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Restaurant</span>
                  <span class="value highlight">${restaurantName}</span>
                </div>
              </div>
              
              <div class="divider"></div>
              
              <p class="support-text">Need help? Contact our support team at <a href="mailto:support@example.com" style="color: #6a1b9a; text-decoration: none;">support@example.com</a></p>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} Your Company. All rights reserved.<br>
              <small>This is an automated message, please do not reply directly.</small>
            </div>
          </div>
        `,
      };
      
      const restaurantMailOptions = {
        from: process.env.EMAIL_USER,
        to: restaurantEmail,
        subject: `New Order Received - ${userName}`,
        html: `
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
            body { font-family: 'Poppins', sans-serif; color: #4a4a4a; max-width: 600px; margin: auto; background-color: #f8f9fa; padding: 0; }
            .container { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); margin: 20px auto; }
            .header { background: linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%); color: white; padding: 30px 20px; text-align: center; }
            .header h1 { margin: 0; font-weight: 600; font-size: 24px; }
            .content { padding: 30px; }
            .greeting { font-size: 20px; font-weight: 600; color: #6a1b9a; margin-bottom: 20px; }
            .intro-text { font-size: 15px; line-height: 1.6; margin-bottom: 25px; }
            .customer-info { background: #f3e5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .order-details { border: 1px solid #e0e0e0; border-radius: 10px; padding: 20px; margin: 25px 0; }
            .detail-row { display: flex; margin-bottom: 12px; align-items: center; }
            .label { font-weight: 500; width: 120px; color: #757575; font-size: 14px; }
            .value { font-weight: 500; color: #212121; }
            .highlight { color: #6a1b9a; font-weight: 600; }
            .divider { height: 1px; background: linear-gradient(to right, transparent, #e0e0e0, transparent); margin: 20px 0; }
            .action-text { font-size: 15px; color: #212121; margin: 25px 0 15px; font-weight: 500; }
            .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #9e9e9e; }
            .badge { display: inline-block; background: #e1bee7; color: #6a1b9a; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; margin-left: 8px; }
          </style>
          <div class="container">
            <div class="header">
              <h1>New Order Notification</h1>
            </div>
            <div class="content">
              <div class="greeting">Hello ${restaurantName},</div>
              <p class="intro-text">You've received a new order that requires your attention.</p>
              
              <div class="customer-info">
                <div class="detail-row">
                  <span class="label">Customer</span>
                  <span class="value highlight">${userName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Order Time</span>
                  <span class="value">${confirmedAtFormatted}</span>
                </div>
              </div>
              
              <div class="order-details">
                <div class="detail-row">
                  <span class="label">Order ID</span>
                  <span class="value highlight">${razorpay_order_id}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Amount</span>
                  <span class="value highlight">₹${updatedPayment.totalCost}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Status</span>
                  <span class="value">${updatedPayment.paymentStatus} <span class="badge">Paid</span></span>
                </div>
              </div>
              
              <div class="divider"></div>
              
              <p class="action-text">Please prepare this order for delivery.</p>
            </div>
            <div class="footer">
              © ${new Date().getFullYear()} Your Company. All rights reserved.<br>
              <small>This is an automated notification.</small>
            </div>
          </div>
        `,
      };
      // ✅ Send both emails
      await transporter.sendMail(userMailOptions);
      await transporter.sendMail(restaurantMailOptions);

      return res.json({
        success: true,
        message: 'Payment verified, emails sent to user and restaurant',
        payment: updatedPayment,
      });
    } else {
      return res.status(400).json({ success: false, message: 'Payment not completed yet' });
    }
  } catch (error) {
    console.error('Payment verification error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Verify Razorpay payment and send confirmation email
// export const verifyRazorpay = async (req, res) => {
//   try {
//     const { razorpay_order_id } = req.body;

//     if (!razorpay_order_id) {
//       return res.status(400).json({ success: false, message: 'Order ID is required for verification' });
//     }

//     const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

//     if (orderInfo.status === 'paid' || orderInfo.status === 'created') {
//       const updatedPayment = await Payment.findOneAndUpdate(
//         { orderId: razorpay_order_id },
//         {
//           paymentStatus: 'paid',
//           confirmedAt: new Date(),
//         },
//         { new: true }
//       ).populate('userId'); // ✅ Populate the user reference

//       if (!updatedPayment) {
//         return res.status(404).json({ success: false, message: 'Payment record not found in database' });
//       }

//       if (!updatedPayment.userId || !updatedPayment.userId.email) {
//         return res.status(400).json({ success: false, message: 'User email not found' });
//       }

//       // ✅ Send confirmation email to userId.email
//       const mailOptions = {
//         from: process.env.EMAIL_USER,
//         to: updatedPayment.userId.email, // ✅ Email picked from userId
//         subject: 'Payment Confirmation - Razorpay',
//         html: `
   
//     <style>
//         body {
//             font-family: 'Arial', sans-serif;
//             line-height: 1.6;
//             color: #333;
//             max-width: 600px;
//             margin: 0 auto;
//             padding: 20px;
//             background-color: #f9f9f9;
//         }
//         .header {
//             background-color: #6a1b9a;
//             color: white;
//             padding: 20px;
//             text-align: center;
//             border-radius: 8px 8px 0 0;
//         }
//         .content {
//             background-color: white;
//             padding: 25px;
//             border-radius: 0 0 8px 8px;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//         }
//         .thank-you {
//             font-size: 24px;
//             color: #6a1b9a;
//             margin-bottom: 20px;
//         }
//         .order-details {
//             background-color: #f5f5f5;
//             padding: 15px;
//             border-radius: 5px;
//             margin: 20px 0;
//         }
//         .detail-row {
//             display: flex;
//             margin-bottom: 8px;
//         }
//         .detail-label {
//             font-weight: bold;
//             width: 120px;
//             color: #555;
//         }
//         .footer {
//             margin-top: 30px;
//             font-size: 12px;
//             color: #777;
//             text-align: center;
//         }
//         .highlight {
//             color: #6a1b9a;
//             font-weight: bold;
//         }
//     </style>

// <body>
//     <div class="header">
//         <h1>Payment Confirmation</h1>
//     </div>
    
//     <div class="content">
//         <div class="thank-you">Thank you, ${updatedPayment.userId.name || 'User'}! 🎉</div>
        
//         <p>Your order has been successfully confirmed. Here are your payment details:</p>
        
//         <div class="order-details">
//             <div class="detail-row">
//                 <span class="detail-label">Order ID:</span>
//                 <span class="highlight">${razorpay_order_id}</span>
//             </div>
//             <div class="detail-row">
//                 <span class="detail-label">Amount Paid:</span>
//                 <span class="highlight">₹${updatedPayment.totalCost}</span>
//             </div>
//             <div class="detail-row">
//                 <span class="detail-label">Payment Status:</span>
//                 <span class="highlight">${updatedPayment.paymentStatus}</span>
//             </div>
//             <div class="detail-row">
//                 <span class="detail-label">Confirmed At:</span>
//                 <span>${updatedPayment.confirmedAt.toLocaleString()}</span>
//             </div>
//             <div class="detail-row">
//                 <span class="detail-label">Restaurant:</span>
//                 <span class="highlight">${updatedPayment.restaurantId}</span>
//             </div>
//         </div>
        
//         <p>We appreciate your business! If you have any questions about your order, please contact our support team.</p>
        
//         <div class="footer">
//             <p>© ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
//         </div>
//     </div>
// </body>

          

//         `,
//       };

//       await transporter.sendMail(mailOptions);

//       return res.json({
//         success: true,
//         message: 'Payment verified and confirmation email sent',
//         payment: updatedPayment,
//       });
//     } else {
//       return res.status(400).json({ success: false, message: 'Payment not completed yet' });
//     }
//   } catch (error) {
//     console.error('Payment verification error:', error.message);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };




export const getAllOrders = async (req, res) => {
  try {
    // Optional: For user-specific order fetch
    const userId = req.user.id;

    const payments = await Payment.find({ userId }).populate('cartId').sort({ createdAt: -1 });

    res.status(200).json({ success: true, payments });
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  }
};
