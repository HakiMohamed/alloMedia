//C:\Users\Youcode\Desktop\AlloMedia\routes\api.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const registerValidation = require('../validations/registerValidation');  // Changement ici
const loginValidation = require('../validations/loginValidation');  // Changement ici
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');





router.post('/register', registerValidation, register);

// Route de connexion
router.post('/login', loginValidation, login);

// Route pour un accès protégé (exemple)
router.get('/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

module.exports = router;
