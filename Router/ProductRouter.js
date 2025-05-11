import express from 'express'
import { upload } from '../Config/multer.js';
import { createProduct, deleteProduct, editProduct, getAllCategories, getAllProducts, getProductById, } from '../Controller/ProductController.js';
import { verifyRestToken } from '../Middleware/RestMiddleware.js';




const ProductRouter = express.Router();



// Add Product 
ProductRouter.post('/addfood',upload.single("image"),verifyRestToken,createProduct)

// Edit Product
ProductRouter.put("/editfood/:id",upload.single("image"),editProduct)

// Delete Product
ProductRouter.delete("/deletefood/:id", deleteProduct);

// GetAll   Products
ProductRouter.get("/getAllfood", getAllProducts);

//Get By Id
ProductRouter.get("/getProductbyId/:id",verifyRestToken,getProductById);

ProductRouter.get("/category/:categoryName", getAllCategories);

export default ProductRouter; 