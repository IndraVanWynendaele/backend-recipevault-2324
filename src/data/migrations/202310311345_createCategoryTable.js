const { tables } = require('..');

module.exports = {
  // migratie uitvoeren
  up: async (knex) => {
    // bij het typen best server uitzetten
    await knex.schema.createTable(tables.category, (table) => {
      table.increments('id').unsigned().notNullable(); // primary key, door increments is het ALTIJD primary key
      table.string('name', 255).notNullable(); // varchar(255), not null

      table.unique('name', 'idx_category_name_unique'); // unique constraint op name
    });
  },
  // migratie ongedaan maken
  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.category);
  },
};