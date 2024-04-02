module.exports = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'RecipeVault API with Swagger',
      version: '0.1.0',
      description:
          'This is a simple CRUD API application made with Koa and documented with Swagger',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
      contact: {
        name: 'RecipeVaultAPI',
        email: 'indra.vanwynendaele@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:9000/',
      },
    ],
    components:{
      securitySchemes:{
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',  
        }, 
      },
    }
    ,
    security: {
      bearerAuth: [],  
    },
  },
  apis: ['./src/rest/*.js'],
  
};