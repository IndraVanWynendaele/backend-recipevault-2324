const { tables } = require('..');

module.exports = {
  up: async (knex) => {
    await knex(tables.difficulty).insert([
      { id: 1, name: 'Easy'},
      { id: 2, name: 'Medium'},
      { id: 3, name: 'Hard'},
    ]);
  },
  down: async (knex) => {
    await knex(tables.category)
      .whereIn('id', [1, 2, 3])
      .delete();
  },
};
