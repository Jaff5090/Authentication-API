const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);

module.exports = app;
