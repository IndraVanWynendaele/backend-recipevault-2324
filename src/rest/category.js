const Joi = require('joi');
const Router = require('@koa/router');

const categoryService = require('../service/category');
const validate = require('../core/validation');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Represents categories for recipes
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    Category:
 *      allOf:
 *        - $ref: "#/components/schemas/Base"
 *        - type: object
 *          required:
 *            - name
 *          properties:
 *            name:
 *              type: "string"
 *          example:
 *            $ref: "#/components/examples/Category"
 *    CategoriesList:
 *      allOf:
 *        - $ref "#/components/schemas/ListResponse"
 *        - type: object
 *          required:
 *            - items
 *          properties:
 *            items:
 *              type: array
 *              items: 
 *                $ref: "#/components/schemas/Category"
 *  examples:
 *    Category:
 *      id: 1
 *      name: "Breakfast"
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *      - Categories
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *              $ref: "#/components/schemas/CategoriesList"
 */
const getAllCategories = async (ctx) => {
  ctx.body = await categoryService.getAll();
};
getAllCategories.validationScheme = null;

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a single category
 *     tags:
 *      - Categories
 *     parameters:
 *       - $ref: "#/components/parameters/idParam"
 *     responses:
 *       200:
 *         description: The requested category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Category"
 *       404:
 *         description: No category with the given id could be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/404NotFound'
 */
const getCategoryById = async (ctx) => {
  ctx.body = await categoryService.getById(Number(ctx.params.id));
};
getCategoryById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  }, 
};

module.exports = (app) => {
  const router = new Router({
    prefix: '/categories',
  });

  router.get('/', validate(getAllCategories.validationScheme), getAllCategories);
  router.get('/:id', validate(getCategoryById.validationScheme), getCategoryById);

  app.use(router.routes())
    .use(router.allowedMethods());
};