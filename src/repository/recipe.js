const { getLogger } = require('../core/logging');
const { tables, getKnex } = require('../data');

const formatRecipe = ({
  categoryId,
  categoryName,
  difficultyId,
  difficultyName,
  userId,
  username,
  ...recipe
}) => {
  return {
    ...recipe,
    category: {
      id: categoryId,
      name: categoryName,
    },
    difficulty: {
      id: difficultyId,
      name: difficultyName,
    },
    user: {
      userId,
      username,
    },
  };
};


const SELECT_COLUMNS = [
  `${tables.recipe}.*`,
  `${tables.category}.id as categoryId`,
  `${tables.category}.name as categoryName`,
  `${tables.difficulty}.id as difficultyId`,
  `${tables.difficulty}.name as difficultyName`,
  `${tables.user}.userId as userId`,
  `${tables.user}.username as username`,
];

const findAll = async () => {
  getLogger().info('finding all recipes');
  const recipes = await getKnex()(tables.recipe)
    .join(tables.category, `${tables.recipe}.recipeCategory`, '=', `${tables.category}.id`)
    .join(tables.difficulty, `${tables.recipe}.recipeDifficulty`, '=', `${tables.difficulty}.id`)
    .join(tables.user, `${tables.recipe}.recipeUserId`, '=', `${tables.user}.userId`)
    .select(SELECT_COLUMNS)
    .orderBy('recipeName');

  return recipes.map(formatRecipe);
};

const findCount = async () => {
  getLogger().info('finding count of recipes');
  const [count] = await getKnex()(tables.recipe).count();
  return count['count(*)'];
};

const findAllByUserId = async (userId) => {
  getLogger().info(`finding all recipes for user with id: ${userId}`);
  const recipes = await getKnex()(tables.recipe)
    .join(tables.category, `${tables.recipe}.recipeCategory`, '=', `${tables.category}.id`)
    .join(tables.difficulty, `${tables.recipe}.recipeDifficulty`, '=', `${tables.difficulty}.id`)
    .join(tables.user, `${tables.recipe}.recipeUserId`, '=', `${tables.user}.userId`)
    .where(`${tables.recipe}.recipeUserId`, userId)
    .select(SELECT_COLUMNS)
    .orderBy('recipeName');

  return recipes.map(formatRecipe);
};

const findCountByUserId = async (userId) => {
  getLogger().info(`finding count of recipes for user with id: ${userId}`);
  const [count] = await getKnex()(tables.recipe)
    .count()
    .where(`${tables.recipe}.recipeUserId`, userId);

  return count['count(*)'];
};

const findById = async (id) => {
  getLogger().info(`finding recipe with id: ${id}`);
  const recipe = await getKnex()(tables.recipe)
    .join(tables.category, `${tables.recipe}.recipeCategory`, '=', `${tables.category}.id`)
    .join(tables.difficulty, `${tables.recipe}.recipeDifficulty`, '=', `${tables.difficulty}.id`)
    .join(tables.user, `${tables.recipe}.recipeUserId`, '=', `${tables.user}.userId`)
    .where(`${tables.recipe}.recipeId`, id)
    .first(SELECT_COLUMNS);
  return recipe && formatRecipe(recipe);
};

const create = async ({ recipeName, recipeDescription, recipePictureUrl, recipeDuration, recipeServings,
  recipeCategory, recipeDifficulty, recipeInstructions, recipeUserId}) => {
  try {
    getLogger().info(`creating recipe ${recipeName}`);
    const [id] = await getKnex()(tables.recipe).insert({
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
    return id;
  } catch (error) {
    getLogger().error('error creating recipe', {error});
    throw error;
  }
};

const updateById = async (id ,{ recipeName, recipeDescription, recipePictureUrl, recipeDuration, recipeServings,
  recipeCategory, recipeDifficulty, recipeInstructions, recipeUserId }) => {
  try {
    getLogger().info(`updating recipe with id ${id}`);
    await getKnex()(tables.recipe)
      .where('recipeId', id)
      .update({
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
  } catch (error) {
    getLogger().error('Error in updateById', { error });
    throw error;
  }
};

const deleteById = async (id, userId) => {
  try {
    getLogger().info(`deleting recipe with id ${id}`);
    const rowsAffected = await getKnex()(tables.recipe)
      .where('recipeId', id)
      .where('recipeUserId', userId)
      .delete();
    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('Error in deleteById', { error });
    throw error;
  }
};

module.exports = { findAll, findCount, findById, create, updateById, deleteById, findAllByUserId, findCountByUserId};