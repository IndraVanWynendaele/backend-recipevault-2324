const RECIPES = [
  {
    recipeId: 1,
    recipeName: 'recipe_one',
    recipeDescription: 'recipe_one_description',
    recipePictureUrl: 'https://i.pinimg.com/564x/20/dd/98/20dd98d752c6769f4b22ff3e0eeec867.jpg',
    recipeDuration: 30,
    recipeServings: 2,
    recipeCategory: 1,
    recipeDifficulty: 1,
    recipeInstructions: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    recipeUserId: 1,
  },
  {
    recipeId: 2,
    recipeName: 'recipe_two',
    recipeDescription: 'recipe_two_description',
    recipePictureUrl: 'https://i.pinimg.com/564x/e0/89/78/e089786326df1b9125cfcc553bd92ab7.jpg',
    recipeDuration: 60,
    recipeServings: 3,
    recipeCategory: 2,
    recipeDifficulty: 3,
    recipeInstructions: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    recipeUserId: 2,
  },
  {
    recipeId: 3,
    recipeName: 'recipe_three',
    recipeDescription: 'recipe_three_description',
    recipePictureUrl: 'https://i.pinimg.com/564x/ea/58/be/ea58be974c9a685d015a32ef85de10c3.jpg',
    recipeDuration: 45,
    recipeServings: 2,
    recipeCategory: 3,
    recipeDifficulty: 1,
    recipeInstructions: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    recipeUserId: 3,
  },
  {
    recipeId: 4,
    recipeName: 'recipe_four',
    recipeDescription: 'recipe_four_description',
    recipePictureUrl: 'https://i.pinimg.com/564x/11/2f/77/112f77292e42aff4db60c60152a982ea.jpg',
    recipeDuration: 45,
    recipeServings: 2,
    recipeCategory: 5,
    recipeDifficulty: 3,
    recipeInstructions: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    recipeUserId: 1,
  },
  {
    recipeId: 5,
    recipeName: 'recipe_five',
    recipeDescription: 'recipe_five_description',
    recipePictureUrl: 'https://hips.hearstapps.com/delish/assets/18/11/1520956952-chicken-tacos-horizontal.jpg',
    recipeDuration: 40,
    recipeServings: 2,
    recipeCategory: 4,
    recipeDifficulty: 'Hard',
    recipeInstructions: 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
    recipeUserId: 2,
  },
];
  
const INGREDIENTS = [
  {
    ingredientId: 1,
    ingredientDescription: 'ingredient_one_description',
    recipeId: 1,
  },
  {
    ingredientId: 2,
    ingredientDescription: 'ingredient_two_description',
    recipeId: 2,
  },
  {
    ingredientId: 3,
    ingredientDescription: 'ingredient_three_description',
    recipeId: 3,
  },
  {
    ingredientId: 4,
    ingredientDescription: 'ingredient_four_description',
    recipeId: 4,
  },
  {
    ingredientId: 5,
    ingredientDescription: 'ingredient_five_description',
    recipeId: 5,
  },
];

const CATEGORIES = [
  {
    categoryId: 1,
    categoryName: 'Breakfast',
  },
  {
    categoryId: 2,
    categoryName: 'Lunch',
  },
  {
    categoryId: 3,
    categoryName: 'Dinner',
  },
  {
    categoryId: 4,
    categoryName: 'Dessert',
  },
  {
    categoryId: 5,
    categoryName: 'Snack',
  },
  {
    categoryId: 6,
    categoryName: 'Drinks',
  },
];
    
const DIFFICULTIES = [
  {
    difficultyId: 1,
    difficultyName: 'Easy',
  },
  {
    difficultyId: 2,
    difficultyName: 'Medium',
  },
  {
    difficultyId: 3,
    difficultyName: 'Hard',
  },
];

const USERLIKEDRECIPES = [
  {
    userLikedRecipeId: 1,
    userId: 1,
    recipeId: 2,
  },
  {
    userLikedRecipeId: 2,
    userId: 2,
    recipeId: 3,
  },
  {
    userLikedRecipeId: 3,
    userId: 3,
    recipeId: 1,
  },
];

module.exports = { RECIPES, INGREDIENTS, CATEGORIES, DIFFICULTIES, USERLIKEDRECIPES };
    