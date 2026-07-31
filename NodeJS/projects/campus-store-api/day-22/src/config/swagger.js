import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerDocument = swaggerJsdoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Campus Store API',
      version: '1.0.0',
      description: 'The cumulative reference project for the Node.js course.',
    },
    servers: [{ url: 'http://localhost:8888' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.js'],
});
