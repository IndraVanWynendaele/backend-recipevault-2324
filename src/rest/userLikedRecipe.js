const Router = require('@koa/router');
const Joi = require('joi');

const userLikedRecipeService = require('../service/userLikedRecipe');
const validate = require('../core/validation');
const { requireAuthentication } = require('../core/auth');

/**
 * @swagger
 * tags:
 *   name: UserLikedRecipes
 *   description: Represents all the liked recipes in the system
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    UserLikedRecipe:
 *      allOf:
 *        - type: object
 *          required:
 *            - userLikedRecipeId
 *            - recipeId
 *            - userId
 *          properties:
 *            userLikedRecipeId:
 *              type: integer
 *            recipeId:
 *              type: integer
 *            userId:
 *              type: integer
 *          example:
 *            $ref: "#/components/examples/UserLikedRecipe"
 *    UserLikedRecipesList:
 *      allOf:
 *        - $ref "#/components/schemas/ListResponse"
 *        - type: object
 *          required:
 *            - items
 *          properties:
 *            items:
 *              type: array
 *              items: 
 *                $ref: "#/components/schemas/UserLikedRecipe"
 *  examples:
 *    UserLikedRecipe:
 *      userLikedRecipeId: 1
 *      recipeId: 2
 *      userId: 1
 *  requestBodies:
 *    UserLikedRecipe:
 *      description: The liked recipe info to save.
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              recipeId:
 *                type: integer
 *                example: 1
 *              userId:
 *                type: integer
 *                example: 2
 */

/**
 * @swagger
 * /api/userLikedRecipes:
 *   get:
 *     summary: Get all recipes liked by all users
 *     tags:
 *      - UserLikedRecipes
 *     responses:
 *       200:
 *         description: List of userLikedRecipes
 *         content:
 *           application/json:
 *             schema:
 *              $ref: "#/components/schemas/UserLikedRecipesList"
 */
const getAllUserLikedRecipes = async (ctx) => {
  const { userId } = ctx.state.session;
  const userLikedRecipes = await userLikedRecipeService.getAll(userId);
  ctx.body = userLikedRecipes;
};
getAllUserLikedRecipes.validationScheme = null;

/**
 * @swagger
 * /api/userLikedRecipes/{recipeId}:
 *   get:
 *    summary: Get a single liked recipe
 *    tags:
 *      - UserLikedRecipes
 *    parameters:
 *      - name: recipeId
 *        description: The id of the liked recipe
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *    responses:
 *      200:
 *        description: The requested liked recipe
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserLikedRecipe"
 *      404:
 *        description: No liked recipe with the given id could be found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/responses/404NotFound'
 */
const getUserLikedRecipeByUserRecipeId = async (ctx) => {
  const { userId } = ctx.state.session;
  ctx.body = await userLikedRecipeService.getByUserRecipeId(userId, Number(ctx.params.id));
};
getUserLikedRecipeByUserRecipeId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/userLikedRecipes:
 *  post:
 *    summary: Create a new liked recipe
 *    description: When a user likes a recipe, the likedRecipe gets created here
 *    tags:
 *      - UserLikedRecipes
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      $ref: "#/components/requestBodies/UserLikedRecipe"
 *    responses:
 *      201:
 *        description: The created liked recipe
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/UserLikedRecipe"
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
const createUserLikedRecipe = async (ctx) => {
  const newUserLikedRecipe = await userLikedRecipeService.create({
    ...ctx.request.body,
    userId: ctx.state.session.userId,
    recipeId: Number(ctx.request.body.recipeId),
  });
  ctx.status = 200;
  ctx.body = newUserLikedRecipe;
};
createUserLikedRecipe.validationScheme = {
  body: {
    recipeId: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/userLikedRecipes/{recipeId}:
 *  delete:
 *    summary: Delete a liked recipe
 *    description: When a user removes a recipe from their likes, the likedRecipe gets deleted here
 *    tags: 
 *      - UserLikedRecipes
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: recipeId
 *        description: The id of the liked recipe to delete
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *    responses:
 *      204:
 *        description: No response, the delete was succesful
 *      404:
 *        description: No liked recipe found with the given id
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/responses/404NotFound"
 */
const deleteUserLikedRecipe = async (ctx) => {
  const { userId } = ctx.state.session;
  await userLikedRecipeService.deleteByUserRecipeId(userId, Number(ctx.params.id));
  ctx.status = 204;
};
deleteUserLikedRecipe.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install UserLikedRecipe routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: '/userLikedRecipes',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllUserLikedRecipes.validationScheme), getAllUserLikedRecipes);
  router.post('/', validate(createUserLikedRecipe.validationScheme), createUserLikedRecipe);
  router.get('/:id', validate(getUserLikedRecipeByUserRecipeId.validationScheme), getUserLikedRecipeByUserRecipeId);
  router.delete('/:id', validate(deleteUserLikedRecipe.validationScheme), deleteUserLikedRecipe);

  app.use(router.routes())
    .use(router.allowedMethods());
};
