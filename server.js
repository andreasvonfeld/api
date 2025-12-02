const express = require('express');
const dotenv = require('dotenv');

const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const usersRoutes = require('./routes/usersRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');

// Charge les variables d'environnement
dotenv.config();

const app = express();

// Middleware JSON
app.use(express.json());

const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route de test
app.get('/', (req, res) => {
  res.send('API des produits (Prisma/PostgreSQL) est opérationnelle.');
});

// Montage des routes
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', usersRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
