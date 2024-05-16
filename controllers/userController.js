const jwt = require('jsonwebtoken');
const User = require('../models/user');

const registerUser = async (req, res) => {
  try {
    const { login, password, firstName, lastName, email, role } = req.body;

    const userExists = await User.findOne({ login });
    if (userExists) {
      return res.status(409).send('Login already exists');
    }

    const user = new User({ login, password, firstName, lastName, email, role });
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.status(201).send({
      message: 'User registered successfully',
      userId: user._id,
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error during user registration');
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

module.exports = { registerUser };
