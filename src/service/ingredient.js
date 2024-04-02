const ingredientRepository = require('../repository/ingredient');
const ServiceError = require('../core/serviceError');
const { getLogger } = require('../core/logging');

const recipeService = require('./recipe');
const handleDBError = require('./_handleDBError');

const getAll = async (recipeId) => {
  const recipe = await recipeService.getById(recipeId);
  if (!recipe) {
    throw ServiceError.notFound(`No recipe with id ${recipeId} exists`, { recipeId });
  }
  const items = await ingredientRepository.findAll(recipeId);
  const count = await ingredientRepository.findCount(recipeId);
  getLogger().info('found all ingredients');
  return {
    items,
    count,
  };
};

const getById = async (id) => {
  const ingredient = await ingredientRepository.findById(id);
  if (!ingredient) {
    throw ServiceError.notFound(`No ingredient with id ${id} exists`, { id });
  }
  getLogger().info(`found ingredient with id: ${id}`);
  return ingredient;
};

const create = async ({ingredientDescription, recipeId}) => {
  const recipe = await recipeService.getById(recipeId);
  if (!recipe) {
    throw ServiceError.notFound(`No recipe with id ${recipeId} exists`, { recipeId });
  }
  try{
    const id = await ingredientRepository.create({
      ingredientDescription,
      recipeId,
    });
    getLogger().info(`created ingredient with id: ${id}`);
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (id, {ingredientDescription, recipeId}) => {
  if(recipeId){
    const recipe = await recipeService.getById(recipeId);
    if (!recipe) {
      throw ServiceError.notFound(`No recipe with id ${recipeId} exists`, { recipeId });
    }
  }

  try {
    await ingredientRepository.updateById(id, {
      ingredientDescription,
      recipeId,
    });
    getLogger().info(`updated ingredient with id: ${id}`);
    return getById(id);
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async (id) => {
  try {
    const deleted = await ingredientRepository.deleteById(id);

    if (!deleted) {
      throw ServiceError.notFound(`No ingredient with id ${id} exists`, { id });
    }
    getLogger().info(`deleted ingredient with id: ${id}`);
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = { getAll, getById, create, updateById, deleteById };