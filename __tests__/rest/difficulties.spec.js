const { withServer } = require('../supertest.setup');

describe('Difficulties', () => {
  
  let request;

  withServer(({
    supertest,
  }) => {
    request = supertest;
  });

  const url = '/api/difficulties';

  describe('GET /api/difficulties', () => {

    it('should 200 and return all difficulties', async () => {
      const response = await request.get(url);
            
      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(3);

      expect(response.body.items[0]).toEqual({
        id: 1,
        name: 'Easy',
      });
      expect(response.body.items[1]).toEqual({
        id: 2,
        name: 'Medium',
      });
      expect(response.body.items[2]).toEqual({
        id: 3,
        name: 'Hard',
      });
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe('GET /api/difficulties/:id', () => {

    it('should 200 and return the requested difficulty', async () => {
      const response = await request.get(`${url}/1`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'Easy',
      });
    });

    it('should 404 when requesting not existing difficulty', async () => {
      const response = await request.get(`${url}/4`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No difficulty with id 4 exists',
        details: {
          id: 4,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid difficulty id', async () => { 
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
});