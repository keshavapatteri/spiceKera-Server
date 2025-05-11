import jwt from 'jsonwebtoken';

export const verifyAdminToken = (req, res, next) => {
  const token = req.cookies.admintoken || req.headers['authorization']?.replace(/^Bearer\s/, '');
// console.log(token);


  if (!token) {
    return res.status(403).json({ success: false,token:false, message: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure role exists
   

    req.admin = verified;
    // console.log(req.user);
    
    next();
  } catch (error) {
    res.status(400).json({ success: false,token:false, error: 'Invalid token' });
  }
};