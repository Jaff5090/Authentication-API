const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authorize = require('../middleware/authorize');
const logRole = require('../middleware/logger');

router.post('/register', userController.registerUser);

router.post('/account', logRole, authorize(['ROLE_ADMIN']), userController.registerUser);

router.get('/account/:id', authorize(['ROLE_ADMIN']), userController.getUserById);

router.put('/account/:id', authorize(['ROLE_ADMIN']), userController.updateUserById);

router.post('/token', userController.createToken);

router.post('/refresh-token', userController.refreshToken);

router.get('/validate/:accessToken', userController.validateToken);



module.exports = router;
