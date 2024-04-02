const {tables} = require('..');

module.exports = {
  // migratie uitvoeren
  // likedBy user table
  up: async (knex) => {
    // bij het typen best server uitzetten
    await knex.schema.createTable(tables.userLikedRecipe, (table) => {
      table.increments('userLikedRecipeId').unsigned().notNullable();
      table.integer('userId').unsigned().notNullable(); 
      table.integer('recipeId').unsigned().notNullable();

      table
        .foreign('userId', 'fk_likedRecipe_user')
        .references(`${tables.user}.userId`)
        .onDelete('CASCADE');
      table
        .foreign('recipeId', 'fk_likedRecipe_recipe')
        .references(`${tables.recipe}.recipeId`)
        .onDelete('CASCADE');
    });
  },
  // migratie ongedaan maken
  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.user);
  },
};