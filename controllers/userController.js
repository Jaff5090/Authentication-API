const jwt = require('jsonwebtoken');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const MAX_LOGIN_ATTEMPTS = 3;
const LOCK_TIME = 5 * 60 * 1000; 

const registerUser = async (req, res) => {
  try {
    const { login, password, firstName, lastName, email, role } = req.body;

    const userExists = await User.findOne({ login });
    if (userExists) {
      return res.status(409).json({ message: 'Login already exists' });
    }

    const user = new User({ login, password, firstName, lastName, email, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error during user registration');
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const createToken = async (req, res) => {
  try {
    const { login, password } = req.body;

    const user = await User.findOne({ login });
    if (!user) {
      return res.status(404).json({ message: 'Identifiants non trouvés' });
    }

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'Compte verrouillé. Réessayez plus tard.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        user.lockUntil = Date.now() + LOCK_TIME;
        user.loginAttempts = 0; 
      }
      await user.save();
      return res.status(404).json({ message: 'Identifiants non trouvés' });
    }

    if (isMatch) {
      user.loginAttempts = 0; 
      user.lockUntil = undefined;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      accessToken: token,
      accessTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      refreshToken: refreshToken,
      refreshTokenExpiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token est requis' });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    } catch (error) {
      return res.status(401).json({ message: 'Refresh token invalide' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    const newRefreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_SECRET_KEY,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      accessToken: newAccessToken,
      accessTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      refreshToken: newRefreshToken,
      refreshTokenExpiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
const validateToken = async (req, res) => {
  try {
    const { accessToken } = req.params;

    if (!accessToken) {
      return res.status(400).json({ message: 'Access token est requis' });
    }

    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.SECRET_KEY);
    } catch (error) {
      return res.status(401).json({ message: 'Token invalide' });
    }

    res.status(200).json({
      accessToken: accessToken,
      accessTokenExpiresAt: new Date(decoded.exp * 1000).toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
module.exports = { registerUser, getUserById, updateUserById, createToken,refreshToken,validateToken };
