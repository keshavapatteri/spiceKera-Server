import Review from "../Models/ReviewModel.js";



// export const createReview = async (req, res) => {

//   try {
//     // Check authentication
//     if (!req.user) {
//       return res.status(401).json({ message: 'User is not authenticated' });
//     }

//     const {  orderId, reviewText, rating } = req.body;
//     const userId = req.user.id;
// console.log(userId );

//     // Debug incoming data
//     console.log('Review Body:', req.body);

//     // Basic field validation
//     if ( !orderId || !reviewText || !rating) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     // Create review
//     const newReview = new Review({
//       userId,
//       orderId,
//       reviewText,
//       rating,
//     });

//     // Save to database
//     await newReview.save();

//     // Populate user info for response
//     const populatedReview = await Review.findById(newReview._id).populate(
//       'userId',
//       'email'
//     );

//     // Success response
//     res.status(201).json({
//       message: 'Review added successfully',
//       review: populatedReview,
//     });

//   } catch (error) {
//     console.error('Error creating review:', error);
//     res.status(500).json({
//       message: 'Error adding review',
//       error: error.message,
//     });
//   }
// };



// export const createReview = async (req, res) => {
//   try {
//     if (!req.user) {
//       return res.status(401).json({ message: 'User is not authenticated' });
//     }

//     const { orderId, productId, restaurantId, reviewText, rating } = req.body;
//     const userId = req.user.id;

//     if (!orderId || !productId || !restaurantId || !reviewText || !rating) {
//       return res.status(400).json({ message: 'All fields are required' });
//     }

//     const newReview = new Review({
//       userId,
//       orderId,
//       productId,
//       restaurantId,
//       reviewText,
//       rating,
//     });

//     await newReview.save();

//     const populatedReview = await Review.findById(newReview._id)
//       .populate('userId', 'email')
//       .populate('productId', 'title image')
//       .populate('restaurantId', 'name');

//     res.status(201).json({
//       message: 'Review added successfully',
//       review: populatedReview,
//     });

//   } catch (error) {
//     console.error('Error creating review:', error);
//     res.status(500).json({ message: 'Error adding review', error: error.message });
//   }
// };



// Get all reviews

export const createReview = async (req, res) => {
  try {
    // Check authentication
    if (!req.user) {
      return res.status(401).json({ message: 'User is not authenticated' });
    }

    const { orderId, reviewText, rating } = req.body;
    const userId = req.user.id;
    console.log(userId);
    console.log('Review Body:', req.body);

    // Basic field validation
    if (!orderId || !reviewText || !rating) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if a review already exists for this user and order
    const existingReview = await Review.findOne({ userId, orderId });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this order',data:false });
    }

    // Create review
    const newReview = new Review({
      userId,
      orderId,
      reviewText,
      rating,
    });

    // Save to database
    await newReview.save();

    // Populate user info for response
    const populatedReview = await Review.findById(newReview._id).populate('userId', 'email');

    res.status(201).json({
      message: 'Review added successfully',
      review: populatedReview,
    });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({
      message: 'Error adding review',
      error: error.message,
    });
  }
};






export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).populate("userId");
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
};

// Get a review by ID
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: "Error fetching review", error });
  }
};

// Update a review by ID
export const updateReview = async (req, res) => {
  try {
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review updated successfully", updatedReview });
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
};

// Delete a review by ID
export const deleteReview = async (req, res) => {
  try {
    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
};
