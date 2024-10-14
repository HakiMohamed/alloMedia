# Structure du projet alloMedia

```bash
alloMedia/
│
├── src/
│   ├── config/               # Fichiers de configuration (environnement, connexions)
│   │   ├── db.js             # Configuration de la base de données MongoDB
│   │   ├── dotenv.js         # Chargement des variables d'environnement
│   │   └── nodemailer.js     # Configuration de Nodemailer pour l'envoi d'e-mails
│   │
│   ├── controllers/          # Contrôleurs pour gérer la logique des routes
│   │   ├── authController.js  # Gestion des opérations d'authentification
│   │   ├── userController.js  # Gestion des utilisateurs (CRUD)
│   │   └── orderController.js # Gestion des commandes (CRUD)
│   │
│   ├── models/               # Modèles de données Mongoose
│   │   ├── User.js           # Modèle de l'utilisateur
│   │
│   ├── routes/               # Fichiers de définition des routes
│   │   ├── authRoutes.js     # Routes pour l'authentification
│   │   ├── userRoutes.js     # Routes pour les utilisateurs
│   │   └── orderRoutes.js    # Routes pour les commandes
│   │
│   ├── services/             # Services pour la logique métier
│   │   ├── authService.js    # Logique d'authentification et 2FA
│   │   └── userService.js    # Logique de gestion des utilisateurs
│   │
│   ├── middleware/           # Middleware pour la gestion des requêtes
│   │   ├── authMiddleware.js # Middleware pour vérifier les JWT
│   │   └── errorMiddleware.js # Middleware pour gérer les erreurs
│   │
│   ├── utils/                # Utilitaires divers (validation, gestion des erreurs)
│   │   ├── emailUtils.js     # Fonctionnalités liées à l'envoi d'e-mails
│   │   └── otpUtils.js       # Fonctionnalités liées à l'OTP
│   │
│   ├── tests/                # Tests unitaires
│   │   ├── auth.test.js      # Tests pour l'authentification
│   │   ├── user.test.js      # Tests pour les utilisateurs
│   │   └── order.test.js     # Tests pour les commandes
│   │
│   └── server.js             # Fichier principal pour démarrer le serveur Express
│
├── .env                       # Fichier de configuration des variables d'environnement
├── .gitignore                 # Fichiers à ignorer par Git
├── package.json               # Fichier de configuration de npm
└── README.md                  # Documentation du projet
```


Explications des dossiers et fichiers :
config/ : Contient la configuration de votre application, comme la connexion à MongoDB, les variables d'environnement et la configuration de Nodemailer.

controllers/ : Regroupe les fichiers qui contiennent la logique pour traiter les requêtes HTTP et interagir avec les modèles. Chaque contrôleur gère une partie spécifique de l'application (authentification, utilisateurs, commandes).

models/ : Contient les modèles de données Mongoose qui définissent la structure des données dans la base de données MongoDB.

routes/ : Définit les routes de votre application. Chaque fichier de routes correspond à un ensemble spécifique de fonctionnalités (authentification, utilisateurs, commandes).

services/ : Contient la logique métier de votre application. Cela permet de séparer les préoccupations et de rendre les contrôleurs plus clairs.

middleware/ : Contient des middleware personnalisés pour gérer des fonctionnalités comme l'authentification (vérification des tokens JWT) et la gestion des erreurs.

utils/ : Contient des fonctions utilitaires réutilisables, comme celles pour l'envoi d'e-mails ou la gestion des OTP.

tests/ : Contient les tests unitaires pour différentes parties de votre application, garantissant que votre code fonctionne comme prévu.

server.js : Fichier principal qui initialise le serveur Express et configure les middlewares et routes.

Objectifs et Technologies
MongoDB et Mongoose : Pour la gestion des données des utilisateurs, des commandes et des produits.
JWT pour l’authentification : Pour sécuriser les sessions utilisateurs.
2FA pour sécuriser les connexions : Intégration d'une authentification à deux facteurs.
RESTful API : Pour gérer les requêtes HTTP et les opérations CRUD.
Tests unitaires : Utilisation de Jest ou Mocha pour garantir la robustesse de l'application.



# AlloMedia: Delivery Platform Backend

## Overview

**AlloMedia** is a backend system for a modern delivery platform built using the **MERN stack** (MongoDB, Express.js, and Node.js). This backend handles secure user authentication, profile management, and password reset functionality. The system is designed to provide a robust and scalable API for user management within the delivery platform.

## Features

- **User Registration & Authentication**:
  - Secure user registration with email and password.
  - Login functionality with **JWT-based authentication**.
  - Password hashing using **bcrypt** for added security.

- **Password Reset**:
  - Users can request a password reset link, sent to their registered email.
  - Token-based password reset for secure verification.

- **Profile Management**:
  - Users can update their profile information, including their username and email.

- **Session Handling**:
  - JWT-based token management, with support for token expiration and secure storage.
  
## Technology Stack

### Backend:
- **Node.js**: JavaScript runtime for executing server-side logic.
- **Express.js**: Framework for creating a RESTful API and routing requests.

### Database:
- **MongoDB**: NoSQL database used to store user information, tokens, and other app-related data.
  
### Other Key Libraries:
- **bcrypt.js**: Used for hashing user passwords before storing them in the database.
- **JWT (jsonwebtoken)**: For creating and managing secure authentication tokens.
- **Nodemailer**: To send password reset emails to users.
  
## Installation

### Prerequisites
Ensure the following are installed on your machine:
- **Node.js** (version 14 or higher)
- **MongoDB** (local instance or cloud-based)

### Steps

1. **Clone the Repository**:
   ```bash
   https://github.com/hakiMohamed/AlloMedia.git
   cd AlloMedia

2. **Install Project Dependencies**:
   ```bash
   npm install

3. **Set Up Environment Variables**:
  - Change content  of  `.env`.
  - Update the following fields in the `.env` file:
    ```bash
    MONGO_URI=mongodb://localhost:27017/allomedia
    JWT_SECRET=your_jwt_secret
    EMAIL_USER=your_email
    EMAIL_PASS=your_email_password
    ```
5. **run  in terminal**:
   ```bash
    npm start

## API Endpoints

### Authentication

| HTTP Method | Endpoint                     | Description                                                   |
|-------------|------------------------------|---------------------------------------------------------------|
| POST        | `/api/register`              | Registers a new user.                                        |
| POST        | `/api/login`                 | Logs in the user and returns a JWT token.                   |
| POST        | `/api/request-reset-password`        | Sends a password reset link to the user's email.            |
| POST        | `/api/reset-password/:token` | Resets the user's password using a token.                   |
| POST        | `/api//verify-device` | Send Otp in email for verifiy user devices.                   |
| POST        | `/api/resend-otp` | Re Send Otp in email for verifiy user devices 
|



## Database Models

### User Model
The User model in MongoDB includes:

- **name**: required.
- **email**: Unique and validated for correct format.
- **password**: Hashed before storage using bcrypt.
- **PhoneNumber**: Number of the  user.
- **isVerified**: Boolean indicating if the user's email is verified.
- **otp** : number temp for validate 2FA
- **roles**: Array of roles assigned a user
- **permissions**: Array of permissions assigned a user
- **Devices**: Array of objet Devices off user

## Contributing
Contributions are welcome! Feel free to fork the repository, make your changes, and submit a pull request.



