import express from 'express'
import { createAddress } from '../Controller/AddressController.js';
import { verifyUserToken } from '../Middleware/AuthMiddleware.js';




const AddressRouter = express.Router();



AddressRouter.post("/addAddress",verifyUserToken,createAddress);


export default AddressRouter; 
