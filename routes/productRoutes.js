const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const IsAdmin = require('../middleware/admin');

  // USERS

// Route pour lister TOUS les produits (public)
router.get('/', productController.getProducts);

// Route pour obtenir un produit par ID (public)
router.get('/:id', productController.getProductById);

  // ADMINS

// Route pour CREER un nouveau produit (protégé admin)
router.post('/', protect, IsAdmin, productController.createProduct);

// Route pour mettre à jour un produit par ID (protégé admin)
router.put('/:id', protect, IsAdmin, productController.updateProduct);

// Route pour supprimer un produit par ID (protégé admin)
router.delete('/:id', protect, IsAdmin, productController.deleteProduct);

module.exports = router;