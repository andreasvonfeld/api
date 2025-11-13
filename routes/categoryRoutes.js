const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const IsAdmin = require('../middleware/admin');

  // USERS

// Route pour lister TOUTES les catégories (public)
router.get('/', categoryController.getCategories);

  // ADMINS

// Route pour lister TOUTES les catégories (protégé admin)
router.post('/', protect, IsAdmin, categoryController.createCategory);

module.exports = router;