import jwt from 'jsonwebtoken';

export const verifyRestToken = (req, res, next) => {
  // Read token from cookies or Authorization header
  const token = req.cookies.Resttoken || req.headers['authorization']?.replace(/^Bearer\s/, '');

  if (!token) {
    return res.status(403).json({
      success: false,
      token: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    // Verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Attach decoded token payload to request
    req.Rest = verified;

    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(400).json({
      success: false,
      token: false,
      error: 'Invalid token'
    });
  }
};
