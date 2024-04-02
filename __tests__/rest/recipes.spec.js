const { withServer, login } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');
const { tables } = require('../../src/data');

const data = {
  recipes: [
    {
      recipeId: 1,
      recipeName: 'Test recipe 1',
      recipeDescription: 'Test recipe 1 description',
      recipePictureUrl: 'https://www.google.com',
      recipeDuration: 30,
      recipeServings: 4,
      recipeCategory: 1,
      recipeDifficulty: 3,
      recipeInstructions: 'Test recipe 1 instructions',
      recipeUserId: 1,
    },
    {
      recipeId: 2,
      recipeName: 'Test recipe 2',
      recipeDescription: 'Test recipe 2 description',
      recipePictureUrl: 'https://www.google.com',
      recipeDuration: 30,
      recipeServings: 4,
      recipeCategory: 1,
      recipeDifficulty: 3,
      recipeInstructions: 'Test recipe 2 instructions',
      recipeUserId: 2,
    },
    {
      recipeId: 3,
      recipeName: 'Test recipe 3',
      recipeDescription: 'Test recipe 3 description',
      recipePictureUrl: 'https://www.google.com',
      recipeDuration: 30,
      recipeServings: 4,
      recipeCategory: 1,
      recipeDifficulty: 3,
      recipeInstructions: 'Test recipe 3 instructions',
      recipeUserId: 2,
    },
  ],
};

const dataToDelete = {
  recipes: [1, 2, 3],
};

describe('Recipes', () => {
    
  let request, knex, authHeader;

  withServer(({
    supertest,
    knex: k,
  }) => {
    request = supertest;
    knex = k;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = '/api/recipes';

  describe('GET /api/recipes', () => {

    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes);
    });

    afterAll(async () => {
      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });
       
    it('should 200 and return all recipes', async () => {
      const response = await request.get(url);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(3);

      expect(response.body.items[0]).toEqual({
        recipeId: 1,
        recipeName: 'Test recipe 1',
        recipeDescription: 'Test recipe 1 description',
        recipePictureUrl: 'https://www.google.com',
        recipeDuration: 30,
        recipeServings: 4,
        recipeCategory: 1,
        recipeDifficulty: 3,
        recipeInstructions: 'Test recipe 1 instructions',
        recipeUserId: 1,
        category: {
          id: 1,
          name: 'Breakfast',
        },
        difficulty: {
          id: 3,
          name: 'Hard',
        },
        user: {
          userId: 1,
          username: 'Test User',
        },
      });
      expect(response.body.items[1]).toEqual({
        recipeId: 2,
        recipeName: 'Test recipe 2',
        recipeDescription: 'Test recipe 2 description',
        recipePictureUrl: 'https://www.google.com',
        recipeDuration: 30,
        recipeServings: 4,
        recipeCategory: 1,
        recipeDifficulty: 3,
        recipeInstructions: 'Test recipe 2 instructions',
        recipeUserId: 2,
        category: {
          id: 1,
          name: 'Breakfast',
        },
        difficulty: {
          id: 3,
          name: 'Hard',
        },
        user: {
          userId: 2,
          username: 'Admin User',
        },
      });
      expect (response.body.items[2]).toEqual({
        recipeId: 3,
        recipeName: 'Test recipe 3',
        recipeDescription: 'Test recipe 3 description',
        recipePictureUrl: 'https://www.google.com',
        recipeDuration: 30,
        recipeServings: 4,
        recipeCategory: 1,
        recipeDifficulty: 3,
        recipeInstructions: 'Test recipe 3 instructions',
        recipeUserId: 2,
        category: {
          id: 1,
          name: 'Breakfast',
        },
        difficulty: {
          id: 3,
          name: 'Hard',
        },
        user: {
          userId: 2,
          username: 'Admin User',
        },
      });
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe('GET /api/recipes/:id', () => {
        
    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes[0]);
    });

    afterAll(async () => {   
      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });

    it('should 200 and return the requested recipe', async () => {
      const response = await request.get(`${url}/1`);
            
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        recipeId: 1,
        recipeName: 'Test recipe 1',
        recipeDescription: 'Test recipe 1 description',
        recipePictureUrl: 'https://www.google.com',
        recipeDuration: 30,
        recipeServings: 4,
        recipeCategory: 1,
        recipeDifficulty: 3,
        recipeInstructions: 'Test recipe 1 instructions',
        recipeUserId: 1,
        category: {
          id: 1,
          name: 'Breakfast',
        },
        difficulty: {
          id: 3,
          name: 'Hard',
        },
        user: {
          userId: 1,
          username: 'Test User',
        },
      });
    });

    it('should 404 when requesting not existing recipe', async () => {
      const response = await request.get(`${url}/2`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No recipe with id 2 exists',
        details: {
          recipeId: 2,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid recipe id', async () => { 
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  describe('GET /api/recipes/user/:userId', () => {

    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes);
    });

    afterAll(async () => {
      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });
       
    it('should 200 and return all recipes from the given user', async () => {
      const response = await request.get(`${url}/user/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        recipeId: 1,
        recipeName: 'Test recipe 1',
        recipeDescription: 'Test recipe 1 description',
        recipePictureUrl: 'https://www.google.com',
        recipeDuration: 30,
        recipeServings: 4,
        recipeCategory: 1,
        recipeDifficulty: 3,
        recipeInstructions: 'Test recipe 1 instructions',
        recipeUserId: 1,
        category: {
          id: 1,
          name: 'Breakfast',
        },
        difficulty: {
          id: 3,
          name: 'Hard',
        },
        user: {
          userId: 1,
          username: 'Test User',
        },
      });
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}/user/?invalid=true`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

    testAuthHeader(() => request.post(url));
  });

  describe('POST /api/recipes', () => {
    const recipesToDelete = [];

    afterAll(async () => {
      await knex(tables.recipe)
        .whereIn('recipeId', recipesToDelete)
        .delete();
    });

    it('should 200 and return the created recipe', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 4',
          recipeDescription: 'Test recipe 4 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 1,
          recipeDifficulty: 3,
          recipeInstructions: 'Test recipe 4 instructions',
        });
            
      expect(response.statusCode).toBe(200);
      expect(response.body.recipeId).toBeTruthy();
      expect(response.body.recipeName).toBe('Test recipe 4');
      expect(response.body.recipeDescription).toBe('Test recipe 4 description');
      expect(response.body.recipePictureUrl).toBe('https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg');
      expect(response.body.recipeDuration).toBe(30);
      expect(response.body.recipeServings).toBe(4);
      expect(response.body.recipeCategory).toBe(1);
      expect(response.body.recipeDifficulty).toBe(3);
      expect(response.body.recipeInstructions).toBe('Test recipe 4 instructions');
      expect(response.body.recipeUserId).toBe(1);

      recipesToDelete.push(response.body.recipeId);
    });

    it('should 404 when category does not exist', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 7,
          recipeDifficulty: 3,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No category with id 7 exists',
        details: {
          id: 7,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 404 when difficulty does not exist', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No difficulty with id 5 exists',
        details: {
          id: 5,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing recipeName', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeName');
    });

    it('should 400 when missing recipeDescription', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeDescription');
    });

    it('should 400 when missing recipePictureUrl', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipePictureUrl');
    });

    it('should 400 when missing recipeDuration', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeDuration');
    });

    it('should 400 when missing recipeServings', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeServings');
    });

    it('should 400 when missing recipeCategory', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeCategory');
    });

    it('should 400 when missing recipeDifficulty', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeDifficulty');
    });

    it('should 400 when missing recipeInstructions', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeInstructions');
    });

    testAuthHeader(() => request.post(url));
  });

  describe('PUT /api/recipes/:id', () => {

    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes[0]);
    });

    afterAll(async () => {
      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });

    it('should 200 and return the updated recipe', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Updated recipe 1',
          recipeDescription: 'Updated recipe 1 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 1,
          recipeDifficulty: 3,
          recipeInstructions: 'Updated recipe 1 instructions',
        });
                
      expect(response.statusCode).toBe(200);
      expect(response.body.recipeId).toBeTruthy();
      expect(response.body.recipeName).toBe('Updated recipe 1');
      expect(response.body.recipeDescription).toBe('Updated recipe 1 description');
      expect(response.body.recipePictureUrl).toBe('https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg');
      expect(response.body.recipeDuration).toBe(30);
      expect(response.body.recipeServings).toBe(4);
      expect(response.body.recipeCategory).toBe(1);
      expect(response.body.recipeDifficulty).toBe(3);
      expect(response.body.recipeInstructions).toBe('Updated recipe 1 instructions');
      expect(response.body.recipeUserId).toBe(1);
    });

    it('should 404 when updating not existing recipe', async () => {
      const response = await request.put(`${url}/2`)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Updated recipe 2',
          recipeDescription: 'Updated recipe 2 description',
          recipePictureUrl: 'https://www.google.com',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 1,
          recipeDifficulty: 3,
          recipeInstructions: 'Updated recipe 2 instructions',
        });
            
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No recipe with id 2 exists',
        details: {
          recipeId: 2,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 404 when category does not exist', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 7,
          recipeDifficulty: 3,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No category with id 7 exists',
        details: {
          id: 7,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 404 when difficulty does not exist', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No difficulty with id 5 exists',
        details: {
          id: 5,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing recipeName', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeName');
    });

    it('should 400 when missing recipeDescription', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeDescription');
    });

    it('should 400 when missing recipePictureUrl', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipePictureUrl');
    });

    it('should 400 when missing recipeDuration', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeDuration');
    });

    it('should 400 when missing recipeServings', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeCategory: 3,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeServings');
    });

    it('should 400 when missing recipeCategory', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeDifficulty: 5,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeCategory');
    });

    it('should 400 when missing recipeDifficulty', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeInstructions: 'Test recipe 5 instructions',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeDifficulty');
    });

    it('should 400 when missing recipeInstructions', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeName: 'Test recipe 5',
          recipeDescription: 'Test recipe 5 description',
          recipePictureUrl: 'https://i.pinimg.com/564x/da/b3/fc/dab3fc5e5ac8097a22c60d0239effb43.jpg',
          recipeDuration: 30,
          recipeServings: 4,
          recipeCategory: 3,
          recipeDifficulty: 5,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeInstructions');
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/recipes/:id', () => {

    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes[0]);
    });

    afterAll(async () => {
      await knex(tables.recipe)
        .whereIn('recipeId', [4, 2, 3])
        .delete();
    });


    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 when deleting not existing recipe', async () => {
      const response = await request.delete(`${url}/2`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No recipe with id 2 exists',
        details: {
          recipeId: 2,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid recipe id', async () => { 
      const response = await request.delete(`${url}/invalid`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });
});
