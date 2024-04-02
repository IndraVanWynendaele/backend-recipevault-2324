const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.userLikedRecipe).delete(); 
    
    // then add the fresh userlikedrecipes
    await knex(tables.userLikedRecipe).insert([
      { userLikedRecipeId: 2, userId: 1, recipeId: 2},
      { userLikedRecipeId: 3, userId: 1, recipeId: 3},
      { userLikedRecipeId: 4, userId: 2, recipeId: 1},
      { userLikedRecipeId: 6, userId: 3, recipeId: 2},
    ]);
  },
};