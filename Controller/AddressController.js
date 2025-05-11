import Address from "../Models/AddressModel.js";
import Cart from "../Models/CartModel.js";


export const createAddress = async (req, res) => {
  try {
    const {  street, city, state, postalCode, phoneNumber } = req.body;
    const userId = req.user.id;
    // Fetch the user's cart
    const cart = await Cart.findOne({ userId }).populate('Product.restaurantId');
    if (!cart || cart.Product.length === 0) {
      return res.status(400).json({ error: 'Cart is empty or not found' });
    }

    // Get all unique restaurant IDs from the cart
    const restaurantIds = [...new Set(cart.Product.map(item => item.restaurantId._id.toString()))];

    // Save the new address with all restaurant IDs
    const newAddress = new Address({
      userId,
      cartId: cart._id,
      restaurantId: restaurantIds, // storing multiple IDs
      street,
      city,
      state,
      postalCode,
      phoneNumber,
    });

    await newAddress.save();

    res.status(201).json({
      message: 'Address created successfully',
      address: newAddress,
    });
  } catch (error) {
    console.error('Error creating address:', error);
    res.status(500).json({ error: 'Server error while creating address' });
  }
};


