// C:\Users\Youcode\Desktop\AlloMedia\routes\api.js
const express = require('express');
const router = express.Router();
const { resetPassword, requestPasswordReset } = require('../controllers/resetpasswordController'); 
const { register, login, verifyEmail } = require('../controllers/authController'); 
const registerValidation = require('../validations/registerValidation');  
const loginValidation = require('../validations/loginValidation');  
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { addRole, assignPermissionsToRole } = require('../controllers/roleController');
const { addPermission } = require('../controllers/permissionController');
const { assignRolesToUser } = require('../controllers/userController');
const { verifyOtp,sendOtp } = require('../controllers/otpController'); 

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Enregistrer un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - name
 *               - email
 *               - password
 *     responses:
 *       '201':
 *         description: Utilisateur enregistré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                 token:
 *                   type: string
 *       '400':
 *         description: Erreurs de validation ou email déjà utilisé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       msg:
 *                         type: string
 */
router.post('/register', registerValidation, register);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       '401':
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/login', loginValidation, login);

/**
 * @swagger
 * /verify-email:       
 *   get:
 *     summary: Vérifier l'email d'un utilisateur
 *     responses:
 *       '200':
 *         description: Email vérifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/verify-email', verifyEmail);

/**
 * @swagger
 * /request-reset-password:
 *   post:
 *     summary: Demander la réinitialisation du mot de passe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *             required:
 *               - email
 *     responses:
 *       '200':
 *         description: Lien de réinitialisation du mot de passe envoyé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '404':
 *         description: Utilisateur non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/request-reset-password', requestPasswordReset);

/**
 * @swagger
 * /reset-password:
 *   post:
 *     summary: Réinitialiser le mot de passe d'un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - token
 *               - newPassword
 *     responses:
 *       '200':
 *         description: Mot de passe réinitialisé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: Token invalide ou mot de passe non valide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/reset-password', resetPassword);

/**
 * @swagger
 * /admin:
 *   get:
 *     summary: Accéder à la zone d'administration
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Accès accordé à l'administration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/admin', authMiddleware, roleMiddleware(['admin']), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Ajouter un nouveau rôle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleName:
 *                 type: string
 *             required:
 *               - roleName
 *     responses:
 *       '201':
 *         description: Rôle ajouté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/roles', addRole);

/**
 * @swagger
 * /roles/assign-permissions:
 *   post:
 *     summary: Assigner des permissions à un rôle
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roleId:
 *                 type: string
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - roleId
 *               - permissions
 *     responses:
 *       '200':
 *         description: Permissions assignées avec succès au rôle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/roles/assign-permissions', assignPermissionsToRole);

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Ajouter une nouvelle permission
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permissionName:
 *                 type: string
 *             required:
 *               - permissionName
 *     responses:
 *       '201':
 *         description: Permission ajoutée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/permissions', addPermission);

/**
 * @swagger
 * /users/assign-roles:
 *   post:
 *     summary: Assigner des rôles à un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - userId
 *               - roles
 *     responses:
 *       '200':
 *         description: Rôles assignés avec succès à l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/users/assign-roles', assignRolesToUser);

/**
 * @swagger
 * /verify-device:
 *   post:
 *     summary: Vérifier un appareil via OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *             required:
 *               - otp
 *     responses:
 *       '200':
 *         description: Appareil vérifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '400':
 *         description: OTP invalide
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/verify-device', verifyOtp);
router.post('/resend-otp', sendOtp);


module.exports = router;
