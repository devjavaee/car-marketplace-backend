const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

// Connexion à la DB
connectDB();

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});
