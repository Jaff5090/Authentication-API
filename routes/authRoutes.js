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

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Login already exists
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

/**
 * @openapi
 * /api/auth/token:
 *   post:
 *     summary: Create a new token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Token created successfully
 *       404:
 *         description: Identifiants non trouvés
 *       403:
 *         description: Compte verrouillé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @openapi
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       201:
 *         description: Token refreshed successfully
 *       400:
 *         description: Refresh token est requis
 *       401:
 *         description: Refresh token invalide
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @openapi
 * /api/auth/validate/{accessToken}:
 *   get:
 *     summary: Validate access token
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: accessToken
 *         schema:
 *           type: string
 *         required: true
 *         description: The access token
 *     responses:
 *       200:
 *         description: Token is valid
 *       400:
 *         description: Access token est requis
 *       401:
 *         description: Token invalide
 *       500:
 *         description: Erreur serveur
 */



module.exports = router;
