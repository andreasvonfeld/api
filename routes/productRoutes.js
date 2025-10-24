const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Route pour lister TOUS les produits et pour CREER un nouveau produit
router.route('/')
  .get(productController.getProducts)   // GET /api/products
  .post(productController.createProduct); // POST /api/products

// Route pour obtenir, mettre à jour, et supprimer un produit par ID
router.route('/:id')
  .get(productController.getProductById)    // GET /api/products/:id
  .put(productController.updateProduct)     // PUT /api/products/:id
  .delete(productController.deleteProduct); // DELETE /api/products/:id

module.exports = router;