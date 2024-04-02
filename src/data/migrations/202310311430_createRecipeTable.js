const {tables} = require('..');

module.exports = {
  // migratie uitvoeren
  up: async (knex) => {
    // bij het typen best server uitzetten
    await knex.schema.createTable(tables.recipe, (table) => {
      table.increments('recipeId').unsigned().notNullable(); // Auto-incrementing primary key
      table.string('recipeName', 255).notNullable(); // Recipe name with a maximum length of 255 characters
      table.string('recipeDescription', 255).notNullable(); // Recipe description with a maximum length of 255 characters
      table.string('recipePictureUrl', 255).notNullable(); // URL for the recipe picture
      table.integer('recipeDuration').unsigned().notNullable(); // Recipe duration in minutes
      table.integer('recipeServings').unsigned().notNullable(); // Number of servings
      table.integer('recipeCategory').unsigned().notNullable(); // Category of the recipe
      table.integer('recipeDifficulty').unsigned().notNullable(); // Recipe difficulty level
      table.string('recipeInstructions', 1024).notNullable(); // Recipe instructions with a maximum length of 1024 characters
      table.integer('recipeUserId').unsigned().notNullable(); // User that created the recipe
          
      // Define a foreign key constraint to reference the 'category' table
      table
        .foreign('recipeCategory', 'fk_recipe_category')
        .references(`${tables.category}.id`)
        .onDelete('CASCADE');
      // Define a foreign key constraint to reference the 'difficulty' table
      table
        .foreign('recipeDifficulty', 'fk_recipe_difficulty')
        .references(`${tables.difficulty}.id`)
        .onDelete('CASCADE');

      // createdBy relation
      table
        .foreign('recipeUserId', 'fk_recipe_user')
        .references(`${tables.user}.userId`)
        .onDelete('CASCADE');
    });
  },
  // migratie ongedaan maken
  down: async (knex) => {
    await knex.schema.dropTableIfExists(tables.recipe);
  },
};