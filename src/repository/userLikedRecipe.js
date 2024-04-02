const { getLogger } = require('../core/logging');
const {tables, getKnex} = require('../data/index');

const findAll = async (userId) => {
  getLogger().info('finding all userLikedRecipes');
  return await getKnex()(tables.userLikedRecipe)
    .where('userId', userId)
    .select('*');
};

const findCount = async (userId) => {
  getLogger().info('finding count of userLikedRecipes');
  const [count] = await getKnex()(tables.userLikedRecipe)
    .where('userId', userId)
    .count();
  return count['count(*)'];
};

const findByUserRecipeId = async (userId, recipeId) => {
  getLogger().info(`finding userLikedRecipe with userId: ${userId} and recipeId: ${recipeId}`);
  return await getKnex()(tables.userLikedRecipe)
    .where('userId', userId)
    .where('recipeId', recipeId)
    .first();
};

const create = async ({userId, recipeId}) => {
  try {
    getLogger().info(`creating userLikedRecipe ${userId}`);
    const [id] = await getKnex()(tables.userLikedRecipe).insert({
      userId,
      recipeId,
    });
    return id;
  } catch (error) {
    getLogger().error('error creating userLikedRecipe', {error});
    throw error;
  }
};

const deleteByUserRecipeId = async (userId, recipeId) => {
  try {
    getLogger().info(`deleting userLikedRecipe with userId ${userId} and recipeId ${recipeId}`);
    const rowsAffected = await getKnex()(tables.userLikedRecipe)
      .where('userId', userId)
      .where('recipeId', recipeId)
      .delete();
    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('error deleting userLikedRecipe', {error});
    throw error;
  }
};

module.exports = { findAll, findCount, findByUserRecipeId, create, deleteByUserRecipeId };
