const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ICI ➜ dossier singulier
const { protect } = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.me);

module.exports = router;
