const Router = require('@koa/router');
const Joi = require('joi');

const difficultyService = require('../service/difficulty');
const validate = require('../core/validation');

/**
 * @swagger
 * tags:
 *   name: Difficulties
 *   description: Represents difficulties for recipes
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Difficulty:
 *      allOf:
 *        - $ref: "#/components/schemas/Base"
 *        - type: object
 *          required:
 *            - name
 *          properties:
 *            name:
 *              type: "string"
 *          example:
 *            $ref: "#/components/examples/Difficulty"
 *    DifficultiesList:
 *      allOf:
 *        - $ref "#/components/schemas/ListResponse"
 *        - type: object
 *          required:
 *            - items
 *          properties:
 *            items:
 *              type: array
 *              items: 
 *                $ref: "#/components/schemas/Difficulty"
 *  examples:
 *    Difficulty:
 *      id: 1
 *      name: "Easy"
 */

/**
 * @swagger
 * /api/difficulties:
 *   get:
 *     summary: Get all difficulties
 *     tags:
 *      - Difficulties
 *     responses:
 *       200:
 *         description: List of difficulties
 *         content:
 *           application/json:
 *             schema:
 *              $ref: "#/components/schemas/DifficultiesList"
 */
const getAllDifficulties = async (ctx) => {
  ctx.body = await difficultyService.getAll();
};
getAllDifficulties.validationScheme = null;

/**
 * @swagger
 * /api/difficulties/{id}:
 *   get:
 *     summary: Get a single difficulty
 *     tags:
 *      - Difficulties
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested difficulty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Difficulty"
 *       404:
 *         description: No difficulty with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const getDifficultyById = async (ctx) => {
  ctx.body = await difficultyService.getById(Number(ctx.params.id));
};
getDifficultyById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  }, 
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/difficulties',
  });

  router.get('/', validate(getAllDifficulties.validationScheme), getAllDifficulties);
  router.get('/:id', validate(getDifficultyById.validationScheme), getDifficultyById);

  app.use(router.routes())
    .use(router.allowedMethods());
};