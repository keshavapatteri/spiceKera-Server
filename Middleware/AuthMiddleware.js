import jwt from 'jsonwebtoken';

export const verifyUserToken = (req, res, next) => {
  const token = req.cookies.Usertoken || req.headers['authorization']?.replace(/^Bearer\s/, '');


  if (!token) {
    return res.status(403).json({ success: false,token:false, message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure role exists
   

    req.user = verified;
    // console.log(req.user);
    
    next();
  } catch (error) {
    res.status(400).json({ success: false,token:false, error: 'Invalid token' });
  }
};