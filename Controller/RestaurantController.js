import Restaurant from "../Models/RestaurantModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Product from "../Models/ProductModel.js";
import { Payment } from "../Models/PaymentModel.js";
import Cart from "../Models/CartModel.js";
import nodemailer from 'nodemailer';
  // Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, role: "Restaurant" }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};





// Admin Signup Controller
export const RestaurantSignup = async (req, res) => {
    const { email, password,restaurantname,address,workingtime,phonenumber} = req.body;
  console.log(req.body);
  
    try {
      // Check if all fields are provided
      if (!email || !password || !restaurantname || ! address || !workingtime || ! phonenumber) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Check if Restaurant already exists
      const existingRestaurant = await Restaurant.findOne({ email });
      if (existingRestaurant) {
        return res.status(400).json({ message: "Restaurant already exists." });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new Restaurant
      const newRestaurant = new Restaurant({
        email,
        password: hashedPassword,
        restaurantname,address,workingtime,phonenumber
      });
  
      // Save Restaurant to database
      await newRestaurant.save();
  
      res.status(201).json({ message: "Restaurant registered successfully." });
      console.log(`Restaurant registered successfully with email: ${email}`);
    } catch (error) {
      console.error("Error during Restaurant signup:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  

   //Login

   export const Restaurantlogin = async (req, res) => {
    const { email, password } = req.body;
    console.log('Login attempt:', req.body);
  
    try {
      // Check if the user exists
      const restaurant = await Restaurant.findOne({ email });
  
      if (!restaurant) {
        return res.status(404).json({ msg: "Restaurant not found" });
      }
  
      // Compare entered password with hashed password in DB
      const passwordMatch = await bcrypt.compare(password, restaurant.password);
      if (!passwordMatch) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
  
      // Generate JWT token
      const token = generateToken(restaurant.id);
  // console.log(token);
  
       res.cookie('Resttoken', token, { httpOnly: true, sameSite: 'None', secure: true });
    
      
      // Send successful login response
      return res.status(200).json({
        _id: restaurant.id,
        name: restaurant.name,
        email: restaurant.email,
        token,
        message: "Login successful",
      });
  
    } catch (error) {
      console.error('Login Error:', error.message);
      return res.status(500).json({ message: "Server error" });
    }
  };
  
  //Logout
  
  export const logoutRestaurant = async (req, res) => {
    try {
      // Clear the token (if using cookies)
      res.cookie("Resttoken", "", {
        httpOnly: true,
        expires: new Date(0), // Expire the token immediately
      });
  
      res.status(200).json({ message: "Restaurant logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  //Get all

  export const getAllRestaurant = async (req, res) => {
    try {
      // Get all users from the database
      const restaurant = await Restaurant.find({}).select("-password"); // Exclude password for security
  
      if (restaurant.length === 0) {
        return res.status(404).json({ message: "No Restaurant found" });
      }
  
      res.status(200).json(restaurant);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  export const getRestuarantById = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Find product by ID
      const restaurant = await Restaurant.findById(id);
  
      // Check if product exists
      if (!restaurant) {
        return res.status(404).json({ message: "restaurant not found" });
      }
  
      return res.status(200).json({
        message: "restaurant fetched successfully",
        data: restaurant,
      });
    } catch (error) {
      console.error("Error fetching Restaurant by ID:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };

  export const getProductsByRestaurantId = async (req, res) => {
    try {
      const restaurantId = req.Rest.id;
  
      // Check if the restaurant exists
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }
  
      // Find products by restaurant ID
      const products = await Product.find({ restaurantId });
  
      if (!products || products.length === 0) {
        return res.status(404).json({ message: "No products found for this restaurant" });
      }
  
      return res.status(200).json({
        message: "Products for restaurant fetched successfully",
        data: products,
      });
    } catch (error) {
      console.error("Error fetching products by restaurant ID:", error);
      return res.status(500).json({ 
        message: "Internal Server Error", 
        error: error.message // Includes the actual error message for debugging
      });
    }
  };


  
  export const getProfile = async (req, res) => {
    const restaurantId = req.Rest.id;  // Get restaurant ID from the token
  
    try {
      // Fetch restaurant from the database using the restaurantId
      const restaurant = await Restaurant.findById(restaurantId);
  
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found." });
      }
  
      // Exclude the password field from the response
      const { password, ...restaurantProfile } = restaurant.toObject();
  
      res.status(200).json(restaurantProfile);
      console.log(`Fetched restaurant profile for ID: ${restaurantId}`);
    } catch (error) {
      console.error("Error fetching restaurant profile:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  };
  

  
  // export const getAllOrdersRestaurant = async (req, res) => {
  //   try {
      
 
  //     const restaurantId = req.Rest.id;
  //     const payments = await Payment.find({ restaurantId}).populate('cartId').sort({ createdAt: -1 });
  
  //     res.status(200).json({ success: true, payments });
  //   } catch (error) {
  //     console.error('Error fetching all orders:', error);
  //     res.status(500).json({ success: false, message: 'Failed to fetch orders', error: error.message });
  //   }
  // };


  export const getAllOrdersRestaurant = async (req, res) => {
    try {
      const restaurantId = req.Rest.id.toString(); // Current restaurant
  
      // Fetch all payments where this restaurant is involved
      const payments = await Payment.find({
        restaurantId: { $in: [restaurantId] }
      })
        .populate('userId')
        .sort({ createdAt: -1 });
  
      // Filter each payment's `data` field for current restaurant's items
      const filteredPayments = payments.map(payment => {
        // Filter only items belonging to this restaurant
        const filteredItems = payment.data.filter(item =>
          item.restaurantId?.toString() === restaurantId
        );
  
        return {
          ...payment.toObject(),
          data: filteredItems // Show only relevant items
        };
      });
  console.log("fghh",filteredPayments);
  
      res.status(200).json({
        success: true,
        payments: filteredPayments
      });
  
    } catch (error) {
      console.error('Error fetching restaurant orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      });
    }
  };
  

  export const getOrderCountRestaurant = async (req, res) => {
    try {
      const restaurantId = req.Rest.id.toString();
  
      // Count the number of orders for the restaurant
      const orderCount = await Payment.countDocuments({
        restaurantId: { $in: [restaurantId] }
      });
  
      res.status(200).json({
        success: true,
        orderCount: orderCount // Return the order count
      });
    } catch (error) {
      console.error('Error fetching restaurant order count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch order count',
        error: error.message
      });
    }
  };
  

  //order status changing
 
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to another email provider if needed
    auth: {
      user: process.env.EMAIL_USER, // Load the email user from .env
      pass: process.env.EMAIL_PASS, // Load the password (app-specific password) from .env
    },
  });



  export const updateOrderStatus = async (req, res) => {
    try {
        const restaurantId = req.Rest.id;
        const { status } = req.body;
        
        console.log(`Attempting to update order status for restaurant ${restaurantId} to: ${status}`);

        const validStatuses = ['pending', 'processing', 'ontheway', 'delivered'];
        
        if (!validStatuses.includes(status)) {
            console.error(`Invalid order status received: ${status}`);
            return res.status(400).json({ 
                success: false,
                message: 'Invalid order status',
                validStatuses: validStatuses
            });
        }

        // Find the most recent pending order for this restaurant
        const updatedOrder = await Payment.findOneAndUpdate(
          { 
              restaurantId: { $in: [restaurantId] },
              orderStatus: { $ne: 'delivered' } // Exclude already delivered orders
          },
          { 
              orderStatus: status,
              statusUpdatedAt: new Date()
          },
          { 
              new: true,
              runValidators: true,
              sort: { createdAt: -1 } // Get the most recent order
          }
      )
      .populate('restaurantId')  // Ensure to populate the restaurantId field
      .populate('userId');
      
      if (!updatedOrder) {
          console.error(`No updatable orders found for restaurant: ${restaurantId}`);
          return res.status(404).json({ 
              success: false,
              message: 'No active orders found to update' 
          });
      }
      
      console.log(`Updated order ${updatedOrder._id} to status: ${status}`);
      
      if (!updatedOrder.userId?.email) {
          console.error('No user email found for the order');
          return res.status(400).json({ 
              success: false,
              message: 'User email is missing' 
          });
      }
      
      // Continue with email sending logic...
      
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const statusInfo = {
            pending: { emoji: '🛒', title: 'Order Received', description: 'We have received your order and are preparing it.' },
            processing: { emoji: '👩‍🍳', title: 'Preparing Your Order', description: 'Your delicious meal is being prepared with care.' },
            ontheway: { emoji: '🚚', title: 'On The Way!', description: 'Your order is out for delivery and will arrive soon!' },
            delivered: { emoji: '🎉', title: 'Delivered!', description: 'Your order has been successfully delivered. Enjoy your meal!' }
        };

        const mailOptions = {
            from: `"${updatedOrder.restaurantId.restaurantname}" <${process.env.EMAIL_USER}>`,
            to: updatedOrder.userId.email,
            subject: `${statusInfo[status].emoji} Order Update: ${statusInfo[status].title}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-bottom: 1px solid #e0e0e0;">
                        <h1 style="color: #333;">${statusInfo[status].emoji} ${statusInfo[status].title}</h1>
                        <p style="color: #666;">Order Reference</p>
                    </div>
                    
                    <div style="padding: 20px;">
                        <p style="font-size: 16px;">Hello ${updatedOrder.userId.name || 'Customer'},</p>
                        <p style="font-size: 16px;">${statusInfo[status].description}</p>
                        
                        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 0; font-weight: bold;">Current Status: <span style="color: #2e86de;">${status}</span></p>
                            <p style="margin: 5px 0 0 0;">Updated at: ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <p style="font-size: 16px;">Restaurant: <strong>${updatedOrder.restaurantId.restaurantname}</strong></p>
                        <p style="font-size: 16px;">Total Amount: <strong>₹${updatedOrder.amount}</strong></p>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #e0e0e0; font-size: 14px; color: #666;">
                        <p>If you have any questions, please contact ${updatedOrder.restaurantId.restaurantname} at ${updatedOrder.restaurantId.contact || process.env.SUPPORT_EMAIL}</p>
                        <p>© ${new Date().getFullYear()} ${updatedOrder.restaurantId.restaurantname}. All rights reserved.</p>
                    </div>
                </div>
            `,
            text: `Hello ${updatedOrder.userId.name || 'Customer'},\n\n` +
                  `Your order status has been updated to: ${status}.\n\n` +
                  `${statusInfo[status].description}\n\n` +
                  `Restaurant: ${updatedOrder.restaurantId.restaurantname}\n` +
                  `Total Amount: ₹${updatedOrder.amount}\n\n` +
                  `Thank you for your order!`
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            console.log(`Email notification sent to ${updatedOrder.userId.email}: ${info.messageId}`);
            
            res.status(200).json({
                success: true,
                message: 'Order status updated and user notified successfully',
                order: updatedOrder,
                emailSent: true
            });
            
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            res.status(200).json({
                success: true,
                message: 'Order status updated but failed to send email notification',
                order: updatedOrder,
                emailSent: false,
                warning: 'Email notification failed'
            });
        }

    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error while updating order status',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};



export const checkRest=async(req,res,next)=>{
    
  const restaurant = req.Rest.id;

  console.log(req);
  
  if(!restaurant){
      return res.status(401).json({success:false,message:'restaurant not authenticated'})
      }
  
res.json({success:true,message:'restaurant is authenticated'})

  
          };