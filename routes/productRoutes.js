const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const IsAdmin = require('../middleware/admin');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestion des produits (avec variantes / tailles)
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Récupère la liste de tous les produits
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Liste de produits récupérée avec succès
 */
router.get('/', productController.getProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Récupère un produit via son ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       200:
 *         description: Produit trouvé
 *       404:
 *         description: Produit non trouvé
 */
router.get('/:id', productController.getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crée un nouveau produit (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - categoryId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "T-shirt noir"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Un t-shirt noir en coton"
 *               price:
 *                 type: number
 *                 example: 29.99
 *               categoryId:
 *                 type: integer
 *                 example: 1
 *               variants:
 *                 type: array
 *                 description: Liste des variantes (taille + stock)
 *                 items:
 *                   type: object
 *                   required:
 *                     - sizeId
 *                   properties:
 *                     sizeId:
 *                       type: integer
 *                       example: 2
 *                     stock:
 *                       type: integer
 *                       example: 15
 *     responses:
 *       201:
 *         description: Produit créé
 *       400:
 *         description: Erreur lors de la création du produit
 *       401:
 *         description: Non autorisé
 */
router.post('/', protect, IsAdmin, productController.createProduct);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Met à jour un produit (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "T-shirt noir premium"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Version améliorée du t-shirt noir"
 *               price:
 *                 type: number
 *                 example: 34.99
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *               variants:
 *                 type: array
 *                 description: Si fourni, remplace l'ensemble des variantes existantes
 *                 items:
 *                   type: object
 *                   required:
 *                     - sizeId
 *                   properties:
 *                     sizeId:
 *                       type: integer
 *                       example: 1
 *                     stock:
 *                       type: integer
 *                       example: 20
 *     responses:
 *       200:
 *         description: Produit mis à jour
 *       400:
 *         description: Erreur de mise à jour
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Produit non trouvé
 */
router.put('/:id', protect, IsAdmin, productController.updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Supprime un produit (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du produit
 *     responses:
 *       204:
 *         description: Produit supprimé
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Produit non trouvé ou erreur de suppression
 */
router.delete('/:id', protect, IsAdmin, productController.deleteProduct);

module.exports = router;