const Router = require('@koa/router');
const Joi = require('joi');

const userService = require('../service/user');
const validate = require('../core/validation');
const { requireAuthentication, makeRequireRole } = require('../core/auth');
const Role = require('../core/roles');

const checkUserId = (ctx, next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  // You can only get our own data unless you're an admin
  if (id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      'You are not allowed to view this user\'s information',
      {
        code: 'FORBIDDEN',
      },
    );
  }
  return next();
};

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Represents a user in the system
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       allOf:
 *         - type: object
 *           required:
 *             - userId
 *             - username
 *             - email
 *           properties:
 *             userId:
 *              type: integer
 *             username:
 *              type: "string"
 *             email:
 *              type: "string"
 *              format: email
 *           example:
 *            $ref: "#/components/examples/User"
 *     UsersList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - items
 *           properties:
 *             items:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/User"
 *   examples:
 *     User:
 *       userId: 123
 *       username: "Thomas Aelbecht"
 *       email: "thomas.aelbrecht@hogent.be"
 */

/**
 * @swagger
 * components:
 *   responses:
 *     LoginResponse:
 *       description: The user and a JWT
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 $ref: "#/components/schemas/User"
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c..."
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags:
 *      - Users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/UsersList"
 */
const getAllUsers = async (ctx) => {
  const users = await userService.getAll();
  ctx.body = users;
};
getAllUsers.validationScheme = null;

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *    summary: Get a single user
 *    tags:
 *      - Users
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: userId
 *        description: The id of the user
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *    responses:
 *      200:
 *        description: The requested user
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/User"
 *      403:
 *        description: You can only request your own information unless you're an admin
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/responses/403Forbidden'
 *      404:
 *        description: No user with the given id could be found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/responses/404NotFound'
 */
const getUserById = async (ctx) => {
  const user = await userService.getById(Number(ctx.params.id));
  ctx.status = 200;
  ctx.body = user;
};
getUserById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Try to login
 *     tags:
 *      - Users
 *     requestBody:
 *       description: The credentials of the user to login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: The user and a JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/LoginResponse'
 *       400:
 *         description: You provided invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 *       401:
 *         description: You provided invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               required:
 *                 - code
 *                 - details
 *               properties:
 *                 code:
 *                   type: string
 *                 details:
 *                   type: string
 *                   description: Extra information about the specific error that occured
 *                 stack:
 *                   type: string
 *                   description: Stack trace (only available if set in configuration)
 *               example:
 *                 code: "UNAUTHORIZED"
 *                 details: "The given email and password do not match"
 */
const login = async (ctx) => {
  const { email, password } = ctx.request.body;
  const authInfo = await userService.login(email, password);
  ctx.body = authInfo;
};
login.validationScheme = {
  body: {
    email: Joi.string().email(),
    password: Joi.string(),
  },
};

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register/Create a new user
 *     tags:
 *      - Users
 *     requestBody:
 *       description: The user's data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: The user and a JWT
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/LoginResponse'
 *       400:
 *         description: You provided invalid data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/responses/400BadRequest'
 */
const createUser = async (ctx) => {
  const newUser = await userService.create(
    ctx.request.body,
  );
  ctx.status = 200;
  ctx.body = newUser;
};
createUser.validationScheme = {
  body: {
    username: Joi.string(),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(30),
  },
};

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *    summary: Delete a user
 *    tags:
 *      - Users
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - name: userId
 *        description: The id of the user to delete
 *        in: path
 *        required: true
 *        schema:
 *          type: integer
 *          example: 1
 *    responses:
 *      204:
 *        description: No response, the delete was successful
 *      403:
 *        description: You can only update your own information unless you're an admin
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/responses/403Forbidden'
 *      404:
 *        description: No user with the given id could be found
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/responses/404NotFound'
 */
const deleteUser = async (ctx) => {
  await userService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};
deleteUser.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install User routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = function installUserRoutes(app) {
  const router = new Router({
    prefix: '/users',
  });

  // public routes
  
  router.post('/login', validate(login.validationScheme), login);
  router.post('/register', validate(createUser.validationScheme), createUser);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  // routes with authentication
  router.get('/', requireAuthentication, requireAdmin, validate(getAllUsers.validationScheme), checkUserId, getAllUsers);
  
  router.get('/:id', requireAuthentication, validate(getUserById.validationScheme), checkUserId, getUserById);
  router.delete('/:id', requireAuthentication, validate(deleteUser.validationScheme), checkUserId, deleteUser);

  app.use(router.routes())
    .use(router.allowedMethods());
};