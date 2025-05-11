
import express from 'express'
import {addCategory, AdminLogin, AdminLogut, AdminSignup, AllCategories, AllReviews, checkAdmin, createProduct, deleteById, deleteCategory, deleteProduct, deleteRestaurantById, deletesReview, editById, editProduct, getAllProducts, getAllRestaurant, getAllUser, getById, getProductById, getProductCount, getRestaurantCount, getRestuarantById, getUserCount} from '../Controller/AdminController.js';
import { upload } from '../Config/multer.js';
import { verifyAdminToken } from '../Middleware/AdminMiddleware.js';




/////// Admin Side  =========================......>
const AdminRouter = express.Router();

AdminRouter.use('/register',AdminSignup)

//AdminLogin
AdminRouter.use('/adminlogin',AdminLogin)

//AdminLogout
AdminRouter.use('/adminlogout',verifyAdminToken,AdminLogut)

/////// User Side  =========================......>

//ALL USER
AdminRouter.use('/AllUser',verifyAdminToken,getAllUser)  // token

// USER By Id

AdminRouter.use('/user/:id',verifyAdminToken,getById)

//Edit By User
AdminRouter.use('/edituser/:id',verifyAdminToken,editById)

//Edit By Id
AdminRouter.use('/delete/:id',verifyAdminToken,deleteById)


/////// Product Side  =========================.....>

// Add Product 
AdminRouter.post('/addProduct',verifyAdminToken,upload.single("image"),createProduct)

// Edit Product
AdminRouter.put("/edit/:id",verifyAdminToken,upload.single("image"),editProduct)              

// Delete Product
AdminRouter.delete("/deleteProduct/:id",verifyAdminToken, deleteProduct);

// GetAll   Products
AdminRouter.get("/getAllProducts",verifyAdminToken, getAllProducts);

//Get By Id
AdminRouter.get("/getProductById/:id",verifyAdminToken,getProductById);


/////// Restuarant Side  =========================.....>

AdminRouter.get('/allRestaurant',verifyAdminToken,getAllRestaurant)

AdminRouter.get('/RestuarantById/:id',verifyAdminToken,getRestuarantById)

AdminRouter.delete('/restaurant/:id',verifyAdminToken, deleteRestaurantById);


/// user Review section 
AdminRouter.get("/allReview",verifyAdminToken, AllReviews);

AdminRouter.delete("/ByReview/:id",verifyAdminToken, deletesReview);


//Categories
AdminRouter.post('/addCategories',verifyAdminToken, upload.single('image'), addCategory)


AdminRouter.get("/allCategories", AllCategories);

AdminRouter.delete("/Category/:id",verifyAdminToken, deleteCategory);


//Count
AdminRouter.get("/ProductCount",verifyAdminToken, getProductCount);


AdminRouter.get("/UserCount",verifyAdminToken, getUserCount);

AdminRouter.get("/RestaurantCount",verifyAdminToken, getRestaurantCount);



//Check Auth

AdminRouter.get('/checkAdmin',verifyAdminToken,checkAdmin) 

export default AdminRouter; 