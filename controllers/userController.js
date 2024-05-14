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

module.exports = { registerUser };
