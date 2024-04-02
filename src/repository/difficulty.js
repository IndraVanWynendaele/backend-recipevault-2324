const {tables, getKnex} = require('../data/index');
const { getLogger } = require('../core/logging');

const findAll = async () => {
  getLogger().info('finding all difficulties');
  return await getKnex()(tables.difficulty)
    .select('*')
    .orderBy('id');
};

const findById = async (id) => {
  getLogger().info(`finding difficulty with id: ${id}`);
  return await getKnex()(tables.difficulty)
    .where('id', id)
    .first();
};

const findCount = async () => {
  getLogger().info('finding count of difficulties');
  const [count] = await getKnex()(tables.difficulty)
    .count();
  return count['count(*)'];
};

module.exports = {
  findAll,
  findCount,
  findById,
};