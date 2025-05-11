 import express from 'express'
import { createReview, deleteReview, getAllReviews, getReviewById, updateReview } from '../Controller/ReviewController.js';
import { verifyUserToken } from '../Middleware/AuthMiddleware.js';



const ReviewRouter = express.Router();



// Create a new review
ReviewRouter.post("/createReview",verifyUserToken, createReview);

// Get all reviews
ReviewRouter.get("/getallReview", getAllReviews);

// Get a review by ID
ReviewRouter.get("/byId/:id", getReviewById);

// Update a review by ID
ReviewRouter.put("/editReview/:id", updateReview);

// Delete a review by ID
ReviewRouter.delete("/deleteByReview/:id", deleteReview);


 export default ReviewRouter; 