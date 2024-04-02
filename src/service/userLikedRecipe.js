const userLikedRecipeRepository = require('../repository/userLikedRecipe');
const ServiceError = require('../core/serviceError');
const { getLogger } = require('../core/logging');

const handleDBError = require('./_handleDBError');
const UserService = require('./user');
const RecipeService = require('./recipe');

const getAll = async (userId) => {
  const items = await userLikedRecipeRepository.findAll(userId);
  const count = await userLikedRecipeRepository.findCount(userId);
  getLogger().info('found all userLikedRecipes');
  return {
    items,
    count,
  };
};

const getByUserRecipeId = async (userId, recipeId) => {
  const userLikedRecipe = await userLikedRecipeRepository.findByUserRecipeId(userId, recipeId);
  if (!userLikedRecipe) {
    throw ServiceError.notFound(`No userLikedRecipe with userId ${userId} and recipeId ${recipeId} exists`, 
      { userId, recipeId });
  }
  getLogger().info(`found userLikedRecipe with userId: ${userId} and recipeId: ${recipeId}`);
  return userLikedRecipe;
};

const create = async ({userId, recipeId}) => {
  const existingUser = await UserService.getById(userId);
  if (!existingUser) {
    throw ServiceError.notFound(`No user with id ${userId} exists`, { userId });
  }

  const existingRecipe = await RecipeService.getById(recipeId);
  if (!existingRecipe) {
    throw ServiceError.notFound(`No recipe with id ${recipeId} exists`, { recipeId });
  }

  try {
    await userLikedRecipeRepository.create({
      userId,
      recipeId,
    });
    getLogger().info(`created userLikedRecipe with userId: ${userId} and recipeId: ${recipeId}`);
    return getByUserRecipeId(userId, recipeId);
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteByUserRecipeId = async (userId, recipeId) => {
  try {
    const deleted = await userLikedRecipeRepository.deleteByUserRecipeId(userId, recipeId);
    if (!deleted) {
      throw ServiceError.notFound(`No userLikedRecipe with userId ${userId} and recipeId ${recipeId} exists`, 
        { userId, recipeId });
    }
    getLogger().info(`deleted userLikedRecipe with userId: ${userId} and recipeId: ${recipeId}`);
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = { getAll, getByUserRecipeId, create, deleteByUserRecipeId };