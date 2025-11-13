const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const IsAdmin = require('../middleware/admin');

// ICI ➜ dossier singulier
const { protect } = require('../middleware/auth');

router.get('/allUsers', protect, IsAdmin, usersController.allUsers);
router.delete('/:id', protect, IsAdmin, usersController.deleteUser);

module.exports = router;
