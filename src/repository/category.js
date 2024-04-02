const {tables, getKnex} = require('../data/index');
const { getLogger } = require('../core/logging');

const findAll = async () => {
  getLogger().info('finding all categories');
  return await getKnex()(tables.category)
    .select('*')
    .orderBy('id');
};

const findById = async (id) => {
  getLogger().info(`finding category with id: ${id}`);
  return await getKnex()(tables.category)
    .where('id', id)
    .first();
};

const findCount = async () => {
  getLogger().info('finding count of categories');
  const [count] = await getKnex()(tables.category)
    .count();
  return count['count(*)'];
};

module.exports = {
  findAll,
  findCount,
  findById,
};