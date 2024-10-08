// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'AlloMedia API',
      version: '1.0.0',
      description: 'API documentation for the AlloMedia application',
    },
    servers: [
      {
        url: 'http://localhost:3000', // Update with your API server URL
      },
    ],
  },
  apis: ['routes/api.js'], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
