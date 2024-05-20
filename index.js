require('dotenv').config();
const app = require('./app');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on http://localhost:${process.env.PORT}`);
      console.log(`Swagger API docs available at http://localhost:${process.env.PORT}/api-docs/auth`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
  });

  
