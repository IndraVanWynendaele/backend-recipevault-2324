const { getLogger } = require('../core/logging');
const {tables, getKnex} = require('../data/index');

const findAll = async (recipeId) => {
  getLogger().info('finding all ingredients');
  return await getKnex()(tables.ingredient)
    .where(`${tables.ingredient}.recipeId`, recipeId)
    .select();
};

const findCount = async (recipeId) => {
  getLogger().info('finding count of ingredients');
  const [count] = await getKnex()(tables.ingredient)
    .count()
    .where(`${tables.ingredient}.recipeId`, recipeId);
  return count['count(*)'];
};

const findById = async (id) => {
  getLogger().info(`finding ingredient with id ${id}`);
  return await getKnex()(tables.ingredient)
    .where('ingredientId', id)
    .first();
};

const create = async ({ingredientDescription, recipeId}) => {
  getLogger().info(`creating ingredient ${ingredientDescription}`);
  try {
    const [id] = await getKnex()(tables.ingredient).insert({
      ingredientDescription,
      recipeId,
    });
    return id;
  } catch (error) {
    getLogger().error('error creating ingredient', {error});
    throw error;
  }
};

const updateById = async (id, {ingredientDescription, recipeId}) => {
  getLogger().info(`updating ingredient with id ${id}`);
  try {
    await getKnex()(tables.ingredient)
      .where('ingredientId', id)
      .update({
        ingredientDescription,
        recipeId,
      });
    return id;
  } catch (error) {
    getLogger().error('error updating ingredient', {error});
    throw error;
  }
};

const deleteById = async (id) => {
  getLogger().info(`deleting ingredient with id ${id}`);
  try {
    const rowsAffected = await getKnex()(tables.ingredient)
      .where('ingredientId', id)
      .delete();
    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('error deleting ingredient', {error});
    throw error;
  }
};

module.exports = { findAll, findCount, findById, create, updateById, deleteById };