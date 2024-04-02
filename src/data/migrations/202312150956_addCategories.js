const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex(tables.category).insert([
      { id: 1, name: 'Breakfast'},
      { id: 2, name: 'Lunch'},
      { id: 3, name: 'Dinner'},
      { id: 4, name: 'Dessert'},
      { id: 5, name: 'Snack'},
      { id: 6, name: 'Drinks'},
    ]);
  },
  down: async (knex) => {
    await knex(tables.category)
      .whereIn('id', [1, 2, 3, 4, 5, 6])
      .delete();
  },
};
