const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/cars', carRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('Bienvenue sur Car Marketplace API !');
});

module.exports = app;
