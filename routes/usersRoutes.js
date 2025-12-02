const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const IsAdmin = require('../middleware/admin');

// ICI ➜ dossier singulier
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs (admin uniquement)
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupère la liste de tous les utilisateurs (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 4
 *                       email:
 *                         type: string
 *                         example: "exemple@mail.com"
 *                       role:
 *                         type: string
 *                         example: "ADMIN"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-01-17T14:32:00.123Z"
 *       401:
 *         description: Non autorisé
 */
router.get('/', protect, IsAdmin, usersController.allUsers);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprime un utilisateur par ID (admin)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur à supprimer
 *     responses:
 *       204:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur non trouvé
 *       401:
 *         description: Non autorisé
 */
router.delete('/:id', protect, IsAdmin, usersController.deleteUser);

module.exports = router;
