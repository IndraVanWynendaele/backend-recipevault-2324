const recipeRepository = require('../repository/recipe');
const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');

const handleDBError = require('./_handleDBError');
const CategoryService = require('./category');
const DifficultyService = require('./difficulty');
const UserService = require('./user');

const getAll = async () => {
  const items = await recipeRepository.findAll();
  const count = await recipeRepository.findCount();
  getLogger().info('found all recipes');
  return {
    items,
    count,
  };
};

const getAllByUserId = async (userId) => {
  const items = await recipeRepository.findAllByUserId(userId);
  const count = await recipeRepository.findCountByUserId(userId);
  getLogger().info(`found all recipes for user with id: ${userId}`);
  return {
    items,
    count,
  };
};

const getById = async (recipeId) => {
  const recipe = await recipeRepository.findById(recipeId);
  if (!recipe ) {
    throw ServiceError.notFound(`No recipe with id ${recipeId} exists`, { recipeId });
  }
  getLogger().info(`found recipe with id: ${recipeId}`);
  return recipe;
};

const create = async ({ recipeName, recipeDescription, recipePictureUrl, recipeDuration, recipeServings, 
  recipeCategory, recipeDifficulty, recipeInstructions, recipeUserId }) => {
  const existingCategory = await CategoryService.getById(recipeCategory);
  if (!existingCategory) {
    throw ServiceError.notFound(`No category with id ${recipeCategory} exists`, { recipeCategory });
  }

  const existingDifficulty = await DifficultyService.getById(recipeDifficulty);
  if (!existingDifficulty) {
    throw ServiceError.notFound(`No difficulty with id ${recipeDifficulty} exists`, { recipeDifficulty });
  }

  const existingUser = await UserService.getById(recipeUserId);
  if (!existingUser) {
    throw ServiceError.notFound(`No user with id ${recipeUserId} exists`, { recipeUserId });
  }

  try {
    const recipeId = await recipeRepository.create({
      recipeName,
      recipeDescription,
      recipePictureUrl,
      recipeDuration,
      recipeServings,
      recipeCategory,
      recipeDifficulty,
      recipeInstructions,
      recipeUserId,
    });
    getLogger().info(`created recipe with id: ${recipeId}`);
    return getById(recipeId); 
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (recipeId, { recipeName, recipeDescription, recipePictureUrl, recipeDuration, recipeServings, 
  recipeCategory, recipeDifficulty, recipeInstructions, recipeUserId }) => {
  const existingCategory = await CategoryService.getById(recipeCategory);
  if (!existingCategory) {
    throw ServiceError.notFound(`No category with id ${recipeCategory} exists`, { recipeCategory });
  }

  const existingDifficulty = await DifficultyService.getById(recipeDifficulty);
  if (!existingDifficulty) {
    throw ServiceError.notFound(`No difficulty with id ${recipeDifficulty} exists`, { recipeDifficulty });
  }

  const existingUser = await UserService.getById(recipeUserId);
  if (!existingUser) {
    throw ServiceError.notFound(`No user with id ${recipeUserId} exists`, { recipeUserId });
  }

  try {
    await recipeRepository.updateById(recipeId, {
      recipeName,
      recipeDescription,
      recipePictureUrl,
      recipeDuration,
      recipeServings,
      recipeCategory,
      recipeDifficulty,
      recipeInstructions,
      recipeUserId,
    });
    getLogger().info(`updated recipe with id: ${recipeId}`);
    return getById(recipeId);
  } catch(error){
    throw handleDBError(error);
  }
};

const deleteById = async (recipeId, userId) => {
  try {
    const deleted = await recipeRepository.deleteById(recipeId, userId);

    if (!deleted) {
      throw ServiceError.notFound(`No recipe with id ${recipeId} exists`, { recipeId });
    }
    getLogger().info(`deleted recipe with id: ${recipeId}`);
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getAllByUserId,
};
