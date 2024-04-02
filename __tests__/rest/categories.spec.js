const { withServer } = require('../supertest.setup');

describe('Categories', () => {

  let request;

  withServer(({
    supertest,
  }) => {
    request = supertest;
  });

  const url = '/api/categories';

  describe('GET /api/categories', () => {

    it('should 200 and return all categories', async () => {
      const response = await request.get(url);
            
      expect(response.statusCode).toBe(200);
      expect(response.body.items.length).toBe(6);

      expect(response.body.items[0]).toEqual({
        id: 1,
        name: 'Breakfast',
      });
      expect(response.body.items[1]).toEqual({
        id: 2,
        name: 'Lunch',
      });
      expect(response.body.items[2]).toEqual({
        id: 3,
        name: 'Dinner',
      });
      expect(response.body.items[3]).toEqual({
        id: 4,
        name: 'Dessert',
      });
      expect(response.body.items[4]).toEqual({
        id: 5,
        name: 'Snack',
      });
      expect(response.body.items[5]).toEqual({
        id: 6,
        name: 'Drinks',
      });
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe('GET /api/categories/:id', () => {

    it('should 200 and return the requested category', async () => {
      const response = await request.get(`${url}/1`);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        name: 'Breakfast',
      });
    });

    it('should 404 when requesting not existing category', async () => {
      const response = await request.get(`${url}/7`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'No category with id 7 exists',
        details: {
          id: 7,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid category id', async () => { 
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });
});