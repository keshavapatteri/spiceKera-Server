
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Product from "../Models/ProductModel.js";
import User from "../Models/UserModel.js";
// Generate JWT Token
const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Log the generated token
  console.log(`Generated Token: ${id}`);
  return token;
};

// @desc   Register a new user
// @route  POST /v1/user/signup
// @access Public

export const registerUser = async (req, res) => {
  const { name, email, password, address, phonenumber } = req.body;

  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword, // Storing hashed password
      address,
      phonenumber,
    });

    if (user) {
      // Generate and log the token
      const token = generateToken(user.id);

      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        phonenumber: user.phonenumber,
        token: token,
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllUser = async (req, res) => {
  try {
    // Get all users from the database
    const users = await User.find({}).select("-password"); // Exclude password for security

    if (users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





// @desc   Login a user
// @route  POST /v1/user/login
// @access Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const user = await User.findOne({ email });

const passwordcompare = await bcrypt.compare(password,user.password)

if(!passwordcompare) return res.status(400).json({msg:"Invalid credentials"});
    // Check if user exists and compare plain text password
     {
      // Generate and log the token
      const token = generateToken(user.id);

      res.cookie('Usertoken', token, { httpOnly: true, sameSite: 'None', secure: true });

      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        token: token,
        message: "Login successful",
      });
    
     }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const logoutUser = async (req, res) => {
  try {
   
    res.cookie("Usertoken", "", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      expires: new Date(0), 
    });



    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const Profile = async (req, res) => {
  const userId = req.user.id;

  try {
    const profile = await User.findById(userId).select('-password'); 
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getProductId = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Product ID:", id);

    // Find product by ID and populate restaurant name
    const product = await Product.findById(id).populate({
      path: "restaurantId",
      select: "restaurantname", // Only get restaurant name
    });
console.log(product);

    // Check if product exists
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Console log the restaurant name
    console.log("Restaurant Name:", product.restaurantId?.restaurantname);

    return res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


//Check User

export const checkUser=async(req,res,next)=>{
  
  const user = req.user.id;

  console.log(user);
  
  if(!user){
      return res.status(401).json({success:false,message:'User not authenticated'})
      }
  
res.json({success:true,message:'User is authenticated'})

  
          };