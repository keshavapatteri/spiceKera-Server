import express from 'express'
import { checkUser, getAllUser, getProductId, loginUser, logoutUser, Profile, registerUser } from '../Controller/UserController.js';
import { getAllProducts} from '../Controller/ProductController.js';
import { verifyUserToken } from '../Middleware/AuthMiddleware.js';





const UserRouter = express.Router();

UserRouter.use('/signup',registerUser)

UserRouter.use('/userlogin',loginUser)

UserRouter.use('/logout',logoutUser)

UserRouter.use('/getall',getAllUser)


UserRouter.get('/getAllProducts',getAllProducts)

UserRouter.get('/profile',verifyUserToken,Profile)

UserRouter.get('/productByid/:id',getProductId)  //verifyUserToken,

UserRouter.get('/checkUser',verifyUserToken,checkUser) 

 

export default UserRouter; 

// import express from 'express'
// const UserRouter = express.Router();
// export default UserRouter; 
