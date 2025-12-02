const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const IsAdmin = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Gestion des catégories de produits
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Récupère toutes les catégories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Liste des catégories récupérée avec succès
 */
router.get('/', categoryController.getCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Crée une nouvelle catégorie (admin)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "T-shirts"
 *     responses:
 *       201:
 *         description: Catégorie créée
 *       400:
 *         description: Erreur de validation ou autre
 *       401:
 *         description: Non autorisé
 */
router.post('/', protect, IsAdmin, categoryController.createCategory);

module.exports = router;