const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0', // Assurez-vous d'utiliser OpenAPI 3.x
        info: {
            title: 'AlloMedia API',
            version: '1.0.0',
            description: 'Documentation de l\'API pour AlloMedia',
        },
        servers: [
            {
                url: 'http://localhost:3000/api', // URL de votre serveur
            },
        ],
    },
    apis: ['./routes/*.js'], // Chemin vers les routes API
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
