const Router = require('@koa/router');
const Joi = require('joi');

const ingredientService = require('../service/ingredient');
const validate = require('../core/validation');
const { requireAuthentication } = require('../core/auth');

/**
 * @swagger
 * tags:
 *   name: Ingredients
 *   description: Represents ingredients for recipes
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Ingredient:
 *      allOf:
 *        - type: object
 *          required:
 *            - ingredientId
 *            - ingredientDescription
 *            - recipeId
 *          properties:
 *            ingredientId:
 *              type: integer
 *            ingredientDescription:
 *              type: "string"
 *            recipeId:
 *              type: integer
 *          example:
 *            $ref: "#/components/examples/Ingredient"
 *    IngredientsList:
 *      allOf:
 *        - $ref "#/components/schemas/ListResponse"
 *        - type: object
 *          required:
 *            - items
 *          properties:
 *            items:
 *              type: array
 *              items: 
 *                $ref: "#/components/schemas/Ingredient"
 *  examples:
 *    Ingredient:
 *      ingredientId: 1
 *      ingredientDescription: "This is an ingredient"
 *      recipeId: 2
 *  requestBodies:
 *    Ingredient:
 *      description: The ingredient info to save.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              ingredientDescription:
 *                type: string
 *                example: "ingredient description 1"
 *              recipeId:
 *                type: integer
 *                example: 2
 */

/**
 * @swagger
 * /api/ingredients/recipe/{recipeId}:
 *   get:
 *     summary: Get all ingredients from the given recipe
 *     tags:
 *      - Ingredients
 *     parameters:
 *      - name: recipeId
 *        description: The id of the recipe to get the ingredients from
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *     responses:
 *       200:
 *         description: List of ingredients
 *         content:
 *           application/json:
 *             schema:
 *              $ref: "#/components/schemas/IngredientsList"
 */
const getAllIngredients = async (ctx) => {  
  const { recipeId } = ctx.params;
  const ingredients = await ingredientService.getAll(recipeId);
  ctx.body = ingredients;
};
getAllIngredients.validationScheme = {
  params: {
    recipeId: Joi.number().integer().positive(),
  }, 
};
  
/**
 * @swagger
 * /api/ingredients/{ingredientId}:
 *   get:
 *    summary: Get a single ingredient
 *    tags:
 *      - Ingredients
 *    parameters:
 *      - name: ingredientId
 *        description: The id of the ingredient to retrieve
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *    responses:
 *      200:
 *        description: The requested ingredient
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Ingredient"
 *      404:
 *        description: No ingredient with the given id could be found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/responses/404NotFound'
 */
const getIngredientById = async (ctx) => {
  ctx.body = await ingredientService.getById(Number(ctx.params.id));
};
getIngredientById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  }, 
};

/**
 * @swagger
 * /api/ingredients:
 *  post:
 *    summary: Create a new ingredient
 *    description: Creates a new ingredient for a recipe
 *    tags:
 *      - Ingredients
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      $ref: "#/components/requestBodies/Ingredient"
 *    responses:
 *      201:
 *        description: The created ingredient
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Ingredient"
 *      400:
 *        description: You provided invalid data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/responses/400BadRequest"
 *      404:
 *        description: No recipe with the given id could be found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/responses/404NotFound"
 */
const createIngredient = async (ctx) => {
  const newIngredient = await ingredientService.create({
    ...ctx.request.body,
    recipeId: Number(ctx.request.body.recipeId),
  });
  ctx.status = 200;
  ctx.body = newIngredient;
};
createIngredient.validationScheme = {
  body: {
    ingredientDescription: Joi.string(),
    recipeId: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/ingredients/{ingredientId}:
 *  put:
 *    summary: Updating an existing ingredient
 *    tags:
 *      - Ingredients
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: ingredientId
 *        description: The id of the ingredient to update
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *    requestBody:
 *      $ref: "#/components/requestBodies/Ingredient"
 *    responses:
 *      201:
 *        description: The updated ingredient
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Ingredient"
 *      400:
 *        description: You provided invalid data
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/responses/400BadRequest"
 *      404:
 *        description: No ingredient/recipe with the given id could be found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/responses/404NotFound"
 */
const updateIngredient = async (ctx) => {
  ctx.body = await ingredientService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
    recipeId: Number(ctx.request.body.recipeId),
  });
};
updateIngredient.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    ingredientDescription: Joi.string(),
    recipeId: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/ingredients/{ingredientId}:
 *  delete:
 *    summary: Delete an ingredient
 *    tags: 
 *      - Ingredients
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: ingredientId
 *        description: The id of the ingredient to delete
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *    responses:
 *      204:
 *        description: No response, the delete was succesful
 *      404:
 *        description: No ingredient found with the given id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/responses/404NotFound"
 */
const deleteIngredient = async (ctx) => {
  await ingredientService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteIngredient.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  }, 
};
  
/**
 * Install Ingredient routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/ingredients',
  });

  router.get('/recipe/:recipeId', validate(getAllIngredients.validationScheme), getAllIngredients);
  router.get('/:id', validate(getIngredientById.validationScheme), getIngredientById);

  router.use(requireAuthentication);

  router.post('/', validate(createIngredient.validationScheme), createIngredient);
  router.put('/:id', validate(updateIngredient.validationScheme), updateIngredient);
  router.delete('/:id', validate(deleteIngredient.validationScheme), deleteIngredient);

  app.use(router.routes())
    .use(router.allowedMethods());
};
  