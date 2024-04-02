const { tables } = require('..');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.ingredient).delete(); 
    
    // then add the fresh ingredients
    await knex(tables.ingredient).insert([
      {ingredientId: 1, ingredientDescription: '5 grams of ingredient_one', recipeId: 1}, 
      {ingredientId: 2, ingredientDescription: '2 tbsp of ingredient_two', recipeId: 2}, 
      {ingredientId: 3, ingredientDescription: '3 ml of ingredient_three', recipeId: 2},
      {ingredientId: 4, ingredientDescription: '20 grams of ingredient_four', recipeId: 3}, 
      {ingredientId: 5, ingredientDescription: '1/4 kg of ingredient_five', recipeId: 3},
      {ingredientId: 6, ingredientDescription: '1 tsp of ingredient_six', recipeId: 3},
    ]);
  },
};