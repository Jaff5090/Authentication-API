const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authorize = require('../middleware/authorize');
const logRole = require('../middleware/logger');

router.post('/register', userController.registerUser);

router.post('/account', logRole, authorize(['ROLE_ADMIN']), userController.registerUser);

router.post('/token', userController.createToken);


module.exports = router;
