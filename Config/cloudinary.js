import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
dotenv.config();
    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET
        
        
    });
    console.log(`dfcsdfds`,process.env.CLOUD_API_KEY);
  export  const cloudinaryInstance=cloudinary