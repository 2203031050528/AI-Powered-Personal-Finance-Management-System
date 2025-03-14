const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  try {
    // Get token from header
    const token = req.header('x-auth-token');

    // Log token presence
    console.log('Checking auth token:', token ? 'Present' : 'Missing');

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Use the same secret key as in default.json
    const jwtSecret = config.get('jwtSecret');
    console.log('Using JWT Secret:', jwtSecret); // Temporary log for debugging

    // Verify token
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded.user;
    
    // Log successful auth
    console.log('Authentication successful for user:', req.user.id);
    
    next();
  } catch (err) {
    console.error('Authentication error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
}; 