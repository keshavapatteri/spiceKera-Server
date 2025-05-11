import express from 'express'
import { checkRest, getAllOrdersRestaurant, getAllRestaurant, getOrderCountRestaurant, getProductsByRestaurantId, getProfile, getRestuarantById, logoutRestaurant, Restaurantlogin, RestaurantSignup, updateOrderStatus } from '../Controller/RestaurantController.js';
import { verifyRestToken } from '../Middleware/RestMiddleware.js';



const RestaurantRouter = express.Router();

RestaurantRouter.post('/Restaurantregister',RestaurantSignup)

RestaurantRouter.post('/Restaurantlogin',Restaurantlogin)



RestaurantRouter.post('/Restaurantlogout',logoutRestaurant)



RestaurantRouter.get('/allRestaurant',getAllRestaurant)

RestaurantRouter.get('/RestuarantById/:id',getRestuarantById)


RestaurantRouter.get('/restaurantProducts',verifyRestToken, getProductsByRestaurantId);

RestaurantRouter.get('/restaurantProfile',verifyRestToken,getProfile);

RestaurantRouter.get('/restaurantOrders',verifyRestToken,getAllOrdersRestaurant);


RestaurantRouter.get('/orderCountRestaurant',verifyRestToken,getOrderCountRestaurant);



RestaurantRouter.put('/updateOrderStatus',verifyRestToken,updateOrderStatus);

RestaurantRouter.get('/checkRest',verifyRestToken,checkRest);




//Pending add Product......



export default RestaurantRouter; 