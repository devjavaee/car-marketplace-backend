const express = require('express');
const app = express();

const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/cars', carRoutes);

app.get('/', (req, res) => {
  res.send('Bienvenue sur Car Marketplace API !');
});

module.exports = app;
