const {tables} = require('..');

module.exports = {
  // migratie uitvoeren
  up: async (knex) => {
    // bij het typen best server uitzetten
    await knex.schema.createTable(tables.ingredient, (table) => {
      table.increments('ingredientId').unsigned().notNullable(); // primary key, door increments is het ALTIJD primary key
      table.string('ingredientDescription', 255).notNullable(); // varchar(255), not null
      table.integer('recipeId').unsigned().notNullable(); // integer, not null

      table
        .foreign('recipeId', 'fk_recipe_ingredient')
        .references(`${tables.recipe}.recipeId`)
        .onDelete('CASCADE');
    });
  },
  // migratie ongedaan maken
  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.ingredient);
  },
};