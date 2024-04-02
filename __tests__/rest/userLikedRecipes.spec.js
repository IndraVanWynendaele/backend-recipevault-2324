const { withServer, login } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');
const { tables } = require('../../src/data');

const data = {
  userLikedRecipes: [
    {
      userLikedRecipeId: 1,
      userId: 1,
      recipeId: 1,
    },
    {
      userLikedRecipeId: 2,
      userId: 2,
      recipeId: 1,
    },
    {
      userLikedRecipeId: 3,
      userId: 2,
      recipeId: 2,
    },
  ],
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
      recipeUserId: 1,
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
      recipeUserId: 1,
    },
  ],
};

const dataToDelete = {
  userLikedRecipes: [1, 2, 3],
  recipes: [1, 2, 3],
};

describe('UserLikedRecipes', () => {

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

  const url = '/api/userLikedRecipes';

  describe('GET /api/userLikedRecipes', () => {

    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes);
      await knex(tables.userLikedRecipe).insert(data.userLikedRecipes);
    });

    afterAll(async () => {
      await knex(tables.userLikedRecipe)
        .whereIn('userLikedRecipeId', dataToDelete.userLikedRecipes)
        .delete();
        
      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });

    it('should 200 and return all userLikedRecipes', async () => {
      const response = await request.get(url)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.count).toBe(1);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        userLikedRecipeId: 1,
        userId: 1,
        recipeId: 1,
      });
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

    testAuthHeader(() => request.get(url));
  });

  describe('GET /api/userLikedRecipes/:id', () => {
    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes);
      await knex(tables.userLikedRecipe).insert(data.userLikedRecipes[0]);
    });

    afterAll(async () => {
      await knex(tables.userLikedRecipe)
        .whereIn('userLikedRecipeId', dataToDelete.userLikedRecipes)
        .delete();
      
      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });

    it('should 200 and return the requested userLikedRecipe', async () => {
      const response = await request.get(`${url}/1`)
        .set('Authorization', authHeader);
            
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        userLikedRecipeId: 1,
        userId: 1,
        recipeId: 1,
      });
    });

    it('should 404 when requesting not existing userLikedRecipe', async () => {
      const response = await request.get(`${url}/2`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No userLikedRecipe with userId 1 and recipeId 2 exists',
        details: {
          recipeId: 2,
          userId: 1,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid userLikedRecipe id', async () => { 
      const response = await request.get(`${url}/invalid`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(url));
  });

  describe ('POST /api/userLikedRecipes', () => {
    const userLikedRecipesToDelete = [];

    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes);
    });

    afterAll(async () => {
      await knex(tables.userLikedRecipe)
        .whereIn('userLikedRecipeId', dataToDelete.userLikedRecipes)
        .delete();
                
      await knex(tables.recipe)
        .whereIn('recipeId', dataToDelete.recipes)
        .delete();
    });

    it('should 200 and return the created userLikedRecipe', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeId: 3,
        });
                
      expect(response.statusCode).toBe(200);
      expect(response.body.userLikedRecipeId).toBeTruthy();
      expect(response.body.userId).toBe(1);
      expect(response.body.recipeId).toBe(3);

      userLikedRecipesToDelete.push(response.body.userLikedRecipeId);
    });

    it('should 404 when recipe does not exist', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({
          recipeId: 4,
        });

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No recipe with id 4 exists',
        details: {
          recipeId: 4,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 when missing recipeId', async () => {
      const response = await request.post(url)
        .set('Authorization', authHeader)
        .send({  
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('recipeId');
    });

    testAuthHeader(() => request.post(url));
  });

  describe('DELETE /api/userLikedRecipes/:id', () => {

    beforeAll(async () => {
      await knex(tables.recipe).insert(data.recipes);
      await knex(tables.userLikedRecipe).insert(data.userLikedRecipes[0]);
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

    it('should 404 when deleting not existing userLikedRecipe', async () => {
      const response = await request.delete(`${url}/2`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No userLikedRecipe with userId 1 and recipeId 2 exists',
        details: {
          recipeId: 2,
          userId: 1,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid userLikedRecipe id', async () => { 
      const response = await request.delete(`${url}/invalid`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });
});