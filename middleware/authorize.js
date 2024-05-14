require('dotenv').config();
const jwt = require('jsonwebtoken');

const authorize = roles => {
  return (req, res, next) => {
    if (!req.headers.authorization) {
      return res.status(401).send('Unauthorized: No token provided');
    }
    try {
      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        throw new Error('No token provided');
      }
      
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      
      if (!roles.includes(decoded.role)) {
        return res.status(403).send('Access Denied');
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).send('Unauthorized: Invalid token');
    }
  };
};

module.exports = authorize;
