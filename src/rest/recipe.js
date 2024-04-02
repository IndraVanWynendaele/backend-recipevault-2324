const Router = require('@koa/router');
const Joi = require('joi');

const recipeService = require('../service/recipe');
const validate = require('../core/validation');
const { requireAuthentication } = require('../core/auth');

/**
 * @swagger
 * tags:
 *   name: Recipes
 *   description: Represents recipes
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Recipe:
 *      allOf:
 *        - type: object
 *          required:
 *            - recipeId 
 *            - recipeName
 *            - recipeDescription
 *            - recipePictureUrl
 *            - recipeDuration
 *            - recipeServings
 *            - recipeCategory
 *            - recipeDifficulty
 *            - recipeInstructions
 *          properties:
 *            recipeId:
 *              type: integer
 *            recipeName:
 *              type: "string"
 *            recipeDescription:
 *              type: "string"
 *            recipePictureUrl:
 *              type: url
 *            recipeDuration:
 *              type: integer
 *            recipeServings:
 *              type: integer
 *            recipeCategory:
 *              $ref: "#/components/schemas/Category"
 *            recipeDifficulty:
 *              $ref: "#/components/schemas/Difficulty"
 *            recipeInstructions:
 *              type: "string"
 *            recipeUserId:
 *              $ref: "#/components/schemas/User"
 *          example:
 *            $ref: "#/components/examples/Recipe"
 *    RecipesList:
 *      allOf:
 *        - $ref "#/components/schemas/ListResponse"
 *        - type: object
 *          required:
 *            - items
 *          properties:
 *            items:
 *              type: array
 *              items: 
 *                $ref: "#/components/schemas/Recipe"
 *  examples:
 *    Recipe:
 *      recipeId: 1
 *      recipeName: "recipe_one"
 *      recipeDescription: "This is a recipe"
 *      recipePictureUrl: "http://www.recipe.com"
 *      recipeDuration: 30
 *      recipeServings: 4
 *      recipeCategory: 
 *        $ref: "#/components/schemas/Category"
 *      recipeDifficulty: 
 *        $ref: "#/components/schemas/Difficulty"
 *      recipeInstructions: "This is how to make the recipe"
 *      recipeUserId:
 *        $ref: "#/components/schemas/User"
 *  requestBodies:
 *    Recipe:
 *      description: The recipe info to save.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              recipeName:
 *                type: string
 *                example: "recipe_one"
 *              recipeDescription:
 *                type: string
 *                example: "This is a recipe"
 *              recipePictureUrl:
 *                type: url
 *                example: "http://www.recipe.com"
 *              recipeDuration:
 *                type: integer
 *                example: 30
 *              recipeServings:
 *                type: integer
 *                example: 4
 *              recipeCategory:
 *                type: integer
 *                example: 1
 *              recipeDifficulty:
 *                type: integer
 *                example: 1
 *              recipeInstructions:
 *                type: string
 *                example: "This is how to make the recipe"
 *              recipeUserId:
 *                type: integer
 *                example: 1
 */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *    summary: Get all recipes
 *    tags:
 *      - Recipes
 *    responses:
 *      200:
 *        description: List of recipes
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/RecipesList"
 */
const getAllRecipes = async (ctx) => {
  const recipes = await recipeService.getAll();
  ctx.body = recipes;
};
getAllRecipes.validationScheme = null;

/**
 * @swagger
 * /api/recipes/user/{userId}:
 *   get:
 *     summary: Gets all recipes created by the logged in user
 *     tags:
 *      - Recipes
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *      - name: userId
 *        description: The id of the user to get the recipes from
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *     responses:
 *       200:
 *         description: List of recipes from the logged in user
 *         content:
 *           application/json:
 *             schema:
 *              $ref: "#/components/schemas/RecipesList"
 */
const getAllRecipesByUserId = async (ctx) => {
  const { userId } = ctx.state.session;
  ctx.body = await recipeService.getAllByUserId(userId);
};
getAllRecipesByUserId.validationScheme = {
  params: {
    userId: Joi.number().integer().positive(),
  }, 
};

/**
 * @swagger
 * /api/recipes/{recipeId}:
 *   get:
 *    summary: Get a single recipe
 *    tags:
 *      - Recipes
 *    parameters:
 *      - name: recipeId
 *        description: The id of the recipe to retrieve
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *    responses:
 *      200:
 *        description: The requested recipe
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Recipe"
 *      404:
 *        description: No recipe with the given id could be found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/responses/404NotFound'
 */
const getRecipeById = async (ctx) => {
  ctx.body = await recipeService.getById(Number(ctx.params.id));
};
getRecipeById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  }, 
};

/**
 * @swagger
 * /api/recipes:
 *  post:
 *    summary: Create a new recipe
 *    description: Creates a new recipe
 *    tags:
 *      - Recipes
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      $ref: "#/components/requestBodies/Recipe"
 *    responses:
 *      201:
 *        description: The created recipe
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Recipe"
 *      400:
 *        description: You provided invalid data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/responses/400BadRequest"
 *      404:
 *        description: No category/difficulty with the given id could be found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/responses/404NotFound'
 */
const createRecipe = async (ctx) => {
  const newRecipe = await recipeService.create({
    ...ctx.request.body,
    recipeServings: Number(ctx.request.body.recipeServings),    
    recipeCategory: Number(ctx.request.body.recipeCategory),
    recipeDuration: Number(ctx.request.body.recipeDuration),
    recipeDifficulty: Number(ctx.request.body.recipeDifficulty),
    recipeUserId: ctx.state.session.userId,
  });
  ctx.status = 200;
  ctx.body = newRecipe;
};
createRecipe.validationScheme = {
  body: {
    recipeName: Joi.string(),
    recipeDescription: Joi.string(),
    recipePictureUrl: Joi.string(),
    recipeDuration: Joi.number().integer().positive(),
    recipeServings: Joi.number().integer().positive(),
    recipeCategory: Joi.number().integer().positive(),
    recipeDifficulty:  Joi.number().integer().positive(),
    recipeInstructions: Joi.string(),
  },
};

/**
 * @swagger
 * /api/recipes/{recipeId}:
 *  put:
 *    summary: Updating an existing recipe
 *    tags:
 *      - Recipes
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: recipeId
 *        description: The id of the recipe to update
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *    requestBody:
 *      $ref: "#/components/requestBodies/Recipe"
 *    responses:
 *      201:
 *        description: The updated recipe
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Recipe"
 *      400:
 *        description: You provided invalid data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/responses/400BadRequest"
 *      404:
 *        description: No category/difficulty with the given id could be found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/responses/404NotFound'
 */
const updateRecipe = async (ctx) => {
  ctx.body = await recipeService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    recipeServings: Number(ctx.request.body.recipeServings),
    recipeDuration: Number(ctx.request.body.recipeDuration),
    recipeCategory: Number(ctx.request.body.recipeCategory),
    recipeDifficulty: Number(ctx.request.body.recipeDifficulty),
    recipeUserId: ctx.state.session.userId,
  });
};
updateRecipe.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    recipeName: Joi.string(),
    recipeDescription: Joi.string(),
    recipePictureUrl: Joi.string(),
    recipeDuration: Joi.number().integer().positive(),
    recipeServings: Joi.number().integer().positive(),
    recipeCategory: Joi.number().integer().positive(),
    recipeDifficulty:  Joi.number().integer().positive(),
    recipeInstructions: Joi.string(),
  },
};

/**
 * @swagger
 * /api/recipes/{recipeId}:
 *  delete:
 *    summary: Delete a recipe
 *    tags: 
 *      - Recipes
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: recipeId
 *        description: The id of the recipe to delete
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *    responses:
 *      204:
 *        description: No response, the delete was succesful
 *      404:
 *        description: No recipe found with the given id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/responses/404NotFound"
 */
const deleteRecipe = async (ctx) => {
  await recipeService.deleteById(Number(ctx.params.id), ctx.state.session.userId);
  ctx.status = 204;
};
deleteRecipe.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  }, 
};

/**
 * Install Recipe routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/recipes',
  });


  router.get('/', validate(getAllRecipes.validationScheme), getAllRecipes);
  router.get('/:id', validate(getRecipeById.validationScheme), getRecipeById);

  router.use(requireAuthentication);
  router.get('/user/:userId', validate(getAllRecipesByUserId.validationScheme), getAllRecipesByUserId);
  router.post('/', validate(createRecipe.validationScheme), createRecipe);
  router.put('/:id', validate(updateRecipe.validationScheme), updateRecipe);
  router.delete('/:id', validate(deleteRecipe.validationScheme), deleteRecipe);

  app.use(router.routes())
    .use(router.allowedMethods());
};
