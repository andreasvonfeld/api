const express = require('express');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');

// Charge les variables d'environnement
dotenv.config();

const app = express();

// Middleware pour analyser le corps des requêtes en JSON
app.use(express.json());

// Route de base (test de santé du serveur)
app.get('/', (req, res) => {
  res.send('API des produits (Prisma/PostgreSQL) est opérationnelle.');
});

// Montage des routes produits avec le préfixe /api/products
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
