const express = require('express');
const dotenv = require('dotenv');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes'); // si ça existe

// Charge les variables d'environnement
dotenv.config();

const app = express();

// Middleware JSON
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.send('API des produits (Prisma/PostgreSQL) est opérationnelle.');
});

// Montage des routes
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
