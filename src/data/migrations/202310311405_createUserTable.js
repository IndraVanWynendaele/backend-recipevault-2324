const {tables} = require('..');

module.exports = {
  // migratie uitvoeren
  up: async (knex) => {
    // bij het typen best server uitzetten
    await knex.schema.createTable(tables.user, (table) => {
      table.increments('userId').unsigned().notNullable(); // primary key, door increments is het ALTIJD primary key
      table.string('username', 255).notNullable(); // varchar(255), not null

      table.unique('username', 'idx_user_username_unique'); // unique constraint op name
    });
  },
  // migratie ongedaan maken
  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.user);
  },
};