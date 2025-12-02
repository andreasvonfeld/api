const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Gestion du panier de l'utilisateur connecté
 */

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Récupère le panier de l'utilisateur connecté
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Panier récupéré (ou panier vide)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   nullable: true
 *                   example: 1
 *                 userId:
 *                   type: integer
 *                   example: 4
 *                 items:
 *                   type: array
 *                   description: Liste des articles du panier
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 10
 *                       cartId:
 *                         type: integer
 *                         example: 1
 *                       productSizeId:
 *                         type: integer
 *                         example: 3
 *                       quantity:
 *                         type: integer
 *                         example: 2
 *       401:
 *         description: Non authentifié
 */
router.get('/', protect, cartController.getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Ajoute un produit (taille) au panier
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productSizeId
 *               - quantity
 *             properties:
 *               productSizeId:
 *                 type: integer
 *                 example: 3
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Produit ajouté au panier
 *       400:
 *         description: Données invalides ou stock insuffisant
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Variante (productSize) introuvable
 */
router.post('/', protect, cartController.addToCart);

/**
 * @swagger
 * /cart/{productSizeId}:
 *   put:
 *     summary: Met à jour la quantité d'un article du panier
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productSizeId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la variante produit+taille
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *                 example: 3
 *                 description: Nouvelle quantité (0 pour supprimer l'article)
 *     responses:
 *       200:
 *         description: Quantité mise à jour ou article retiré
 *       400:
 *         description: Quantité invalide ou panier introuvable
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Article du panier introuvable
 */
router.put('/:productSizeId', protect, cartController.updateCartItem);

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Vide complètement le panier
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Panier vidé
 *       400:
 *         description: Panier introuvable
 *       401:
 *         description: Non authentifié
 */
router.delete('/clear', protect, cartController.clearCart);

/**
 * @swagger
 * /cart/{cartItemId}:
 *   delete:
 *     summary: Supprime un article spécifique du panier
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cartItemId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ligne du panier à supprimer
 *     responses:
 *       200:
 *         description: Produit retiré du panier
 *       400:
 *         description: cartItemId invalide ou panier introuvable
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Article non trouvé dans le panier
 */
router.delete('/:cartItemId', protect, cartController.removeFromCart);

module.exports = router;