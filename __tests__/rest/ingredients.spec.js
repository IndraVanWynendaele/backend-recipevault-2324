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
  ingredients: [
    {
      ingredientId: 1,
      ingredientDescription: 'Test ingredient 1',
      recipeId: 1,
    },
    {
      ingredientId: 2,
      ingredientDescription: 'Test ingredient 2',
      recipeId: 1,
    },
    {
      ingredientId: 3,
      ingredientDescription: 'Test ingredient 3',
      recipeId: 2,
    },
    {
      ingredientId: 4,
      ingredientDescription: 'Test ingredient 4',
      recipeId: 3,
    },
  ],
};

const dataToDelete = {
  recipes: [1, 2, 3],
  ingredients: [1, 2, 3, 4],
};

describe('Ingredients', () => {

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

  const url = '/api/ingredients';

  describe('GET /api/ingredients/recipe/:recipeId', () => {

    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes);
      await knex(tables.ingredient).insert(data.ingredients);
    });

    afterAll(async () => {
      await knex(tables.ingredient)
        .whereIn('ingredientId', dataToDelete.ingredients)
        .delete();

      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });

    it('should 200 and return all ingredients of the given recipe', async () => {
      const response = await request.get(`${url}/recipe/1`);

      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(2);

      expect(response.body.items[0]).toEqual({
        ingredientId: 1,
        ingredientDescription: 'Test ingredient 1',
        recipeId: 1,
      });
      expect(response.body.items[1]).toEqual({
        ingredientId: 2,
        ingredientDescription: 'Test ingredient 2',
        recipeId: 1,
      });
    });

    it('should 404 when requesting not existing recipe', async () => {
      const response = await request.get(`${url}/recipe/123`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No recipe with id 123 exists',
        details: {
          recipeId: 123,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}/recipe/?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe('GET /api/ingredients/:id', () => {
    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes);
      await knex(tables.ingredient).insert(data.ingredients[0]);
    });

    afterAll(async () => {
      await knex(tables.ingredient)
        .whereIn('ingredientId', dataToDelete.ingredients)
        .delete();

      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });

    it('should 200 and return the requested ingredient', async () => {
      const response = await request.get(`${url}/1`);
            
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        ingredientId: 1,
        ingredientDescription: 'Test ingredient 1',
        recipeId: 1,
      });
    });

    it('should 404 when requesting not existing ingredient', async () => {
      const response = await request.get(`${url}/2`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No ingredient with id 2 exists',
        details: {
          id: 2,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid ingredient id', async () => { 
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });

  describe ('POST /api/ingredients', () => {
    const ingredientsToDelete = [];

    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes);
    });

    afterAll(async () => {
      await knex(tables.ingredient)
        .whereIn('ingredientId', ingredientsToDelete)
        .delete();

      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });

    it('should 200 and return the created ingredient', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          ingredientDescription: 'Test ingredient 5',
          recipeId: 1,
        });
                
      expect(response.statusCode).toBe(200);
      expect(response.body.ingredientId).toBeTruthy();
      expect(response.body.ingredientDescription).toBe('Test ingredient 5');
      expect(response.body.recipeId).toBe(1);

      ingredientsToDelete.push(response.body.ingredientId);
    });

    it('should 404 when recipe does not exist', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          ingredientDescription: 'Test ingredient 5',
          recipeId: 7,  
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No recipe with id 7 exists',
        details: {
          recipeId: 7,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing ingredientDescription', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeId: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('ingredientDescription');
    });

    it('should 400 when missing recipe', async () => { 
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          ingredientDescription: 'beschrijving',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeId');
    });

    testAuthHeader(() => request.post(url));
  });

  describe('PUT /api/ingredients/:id', () => {
        
    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes);
      await knex(tables.ingredient).insert(data.ingredients);
    });

    afterAll(async () => {
      await knex(tables.ingredient)
        .whereIn('ingredientId', dataToDelete.ingredients)
        .delete();

      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });

    it('should 200 and return the updated ingredient', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          ingredientDescription: 'Test ingredient 1 updated',
          recipeId: 1,
        });
                
      expect(response.statusCode).toBe(200);
      expect(response.body.ingredientId).toBe(1);
      expect(response.body.ingredientDescription).toBe('Test ingredient 1 updated');
      expect(response.body.recipeId).toBe(1);
    });

    it('should 404 when updating not existing ingredient', async () => {
      const response = await request.put(`${url}/5`)
        .set('Authorization', authHeader)
        .send({
          ingredientDescription: 'Test ingredient 5',
          recipeId: 1,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No ingredient with id 5 exists',
        details: {
          id: 5,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 404 when recipe does not exist', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          ingredientDescription: 'Test ingredient 5',
          recipeId: 7,  
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No recipe with id 7 exists',
        details: {
          recipeId: 7,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing ingredientDescription', async () => {
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          recipeId: 1,
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('ingredientDescription');
    });

    it('should 400 when missing recipe', async () => { 
      const response = await request.put(`${url}/1`)
        .set('Authorization', authHeader)
        .send({
          ingredientDescription: 'beschrijving',
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeId');
    });

    testAuthHeader(() => request.put(`${url}/1`));
  });

  describe('DELETE /api/ingredients/:id', () => {

    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes);
      await knex(tables.ingredient).insert(data.ingredients[0]);
    });

    afterAll(async () => {

      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`)
        .set('Authorization', authHeader);
                
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 with not existing ingredient', async () => {
      const response = await request.delete(`${url}/5`)
        .set('Authorization', authHeader);
                
      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No ingredient with id 5 exists',
        details: {
          id: 5,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid ingredient id', async () => {
      const response = await request.delete(`${url}/invalid`)
        .set('Authorization', authHeader);
                
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });
});