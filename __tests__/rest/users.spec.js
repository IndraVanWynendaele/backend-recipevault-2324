const { tables } = require('../../src/data');
const Role = require('../../src/core/roles');
const { withServer, login, loginAdmin } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');

const data = {
  users: [
    {
      userId: 3,
      username: 'user1',
      email: 'one@user.be',
      password_hash: 'doesntmatter',
      roles: JSON.stringify([Role.USER]),
    },
    {
      userId: 4,
      username: 'user2',
      email: 'two@user.be',
      password_hash: 'doesntmatter',
      roles: JSON.stringify([Role.USER]),
    },
    {
      userId: 5,
      username: 'user3',
      email: 'three@user.be',
      password_hash: 'doesntmatter',
      roles: JSON.stringify([Role.USER]),
    },
  ],
};

const dataToDelete = {
  users: [3, 4, 5],
};

describe('Users', () => {

  let request, knex, authHeader, adminAuthHeader;

  withServer(({
    supertest,
    knex: k,
  }) => {
    request = supertest;
    knex = k;
  });

  beforeAll(async () => {
    authHeader = await login(request);
    adminAuthHeader = await loginAdmin(request);
  });

  const url = '/api/users';

  describe('GET /api/users', () => {

    beforeAll(async () => {
      await knex(tables.user).insert(data.users);
    });

    afterAll(async () => {
      await knex(tables.user)
        .whereIn('userId', dataToDelete.users)
        .delete();
    });

    it('should 200 and return all users', async () => {
      const response = await request.get(url)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body.count).toBeGreaterThanOrEqual(3);
      expect(response.body.items.length).toBeGreaterThanOrEqual(3);

      expect(response.body.items).toEqual(expect.arrayContaining([{
        userId: 3,
        username: 'user1',
        email: 'one@user.be',
        roles: [Role.USER],
      },{
        userId: 5,
        username: 'user3',
        email: 'three@user.be',
        roles: [Role.USER],
      }]));
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });

    testAuthHeader(() => request.get(url));
  });

  describe('GET /api/users/:id', () => {
    beforeAll(async () => {
      await knex(tables.user).insert(data.users[0]);
    });

    afterAll(async () => {
      await knex(tables.user)
        .whereIn('userId', dataToDelete.users)
        .delete();
    });

    it('should 200 and return the requested user', async () => {
      const response = await request.get(`${url}/1`)
        .set('Authorization', authHeader);
            
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        userId: 1,
        username: 'Test User',
        email: 'test.user@hogent.be',
        roles: [Role.USER],
      });
    });

    it('should 400 with invalid user id', async () => { 
      const response = await request.get(`${url}/invalid`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    testAuthHeader(() => request.get(`${url}/1`));
  });

  describe ('POST /api/users/register', () => {

    afterAll(async () => {
      await knex(tables.user)
        .where('userId', '>' , 2) // test user id = 1, admin user id = 2
        .delete();
    });

    it('should 200 and return the created user', async () => {
      const response = await request.post(`${url}/register`)
        .send({
          username: 'new user',
          email: 'new_user@gmail.com',
          password: '12345678',
        });
                
      expect(response.statusCode).toBe(200);
      expect(response.body.token).toBeTruthy();
      expect(response.body.user.username).toBe('new user');
      expect(response.body.user.email).toBe('new_user@gmail.com');
      expect(response.body.user.passwordHash).toBeUndefined();
    });

    it('should 400 when missing username', async () => {
      const response = await request.post(`${url}/register`)
        .send({});

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('username');
    });
  });

  describe('DELETE /api/users/:id', () => {

    beforeAll(async () => {
      await knex(tables.user).insert(data.users[0]);
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/3`)
        .set('Authorization', adminAuthHeader);
                
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });

    it('should 404 when deleting not existing user', async () => {
      const response = await request.delete(`${url}/256`)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No user with id 256 exists',
        details: {
          id: 256,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid user id', async () => { 
      const response = await request.delete(`${url}/invalid`)
        .set('Authorization', adminAuthHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });

    it('should 403 when not admin', async () => {
      const response = await request.delete(`${url}/3`)
        .set('Authorization', authHeader);

      expect(response.statusCode).toBe(403);
      expect(response.body).toMatchObject({
        code: 'FORBIDDEN',
        message: 'You are not allowed to view this user\'s information',
      });
      expect(response.body.stack).toBeTruthy();      
    });

    testAuthHeader(() => request.delete(`${url}/1`));
  });
});