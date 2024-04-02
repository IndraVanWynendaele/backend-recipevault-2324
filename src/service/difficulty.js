const difficultyRepository = require('../repository/difficulty');
const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');

const getAll = async () => {
  const items = await difficultyRepository.findAll();
  getLogger().info('found all difficulties');
  return {
    items,
    count: items.length,
  };
};

const getById = async (id) => {
  const difficulty = await difficultyRepository.findById(id);

  if (!difficulty) {
    throw ServiceError.notFound(`No difficulty with id ${id} exists`, { id });
  }
  getLogger().info(`found difficulty with id: ${id}`);
  return difficulty;
};

module.exports = { getAll, getById };

