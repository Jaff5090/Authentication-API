const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


const app = express();

app.use(helmet());

app.use(cors());

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api-doc', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;
