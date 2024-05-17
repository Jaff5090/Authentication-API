const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API AUTH',
    version: '1.0.0',
    description: 'API AUTH'
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development Server'
    }
  ]
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
