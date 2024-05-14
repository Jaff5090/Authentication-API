const jwt = require('jsonwebtoken');

const logRole = (req, res, next) => {
  if (!req.headers.authorization) {
    console.log('Unauthorized access attempt: No token provided');
    return res.status(401).send('Unauthorized: No token provided');
  }
  
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
      console.log('Unauthorized access attempt: No token provided');
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;

    if (decoded.role === 'ROLE_ADMIN') {
      console.log('Admin access attempt');
    } else if (decoded.role === 'ROLE_USER') {
      console.log('User access attempt');
    } else {
      console.log('Unknown role access attempt');
    }

    next();
  } catch (error) {
    console.log('Unauthorized access attempt: Invalid token');
    return res.status(401).send('Unauthorized: Invalid token');
  }
};

module.exports = logRole;
