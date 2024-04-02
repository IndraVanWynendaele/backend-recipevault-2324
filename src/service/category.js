const categoryRepository = require('../repository/category');
const { getLogger } = require('../core/logging');
const ServiceError = require('../core/serviceError');

const getAll = async () => {
  const items = await categoryRepository.findAll();
  getLogger().info('found all categories');
  return {
    items,
    count: items.length,
  };
};

const getById = async (id) => {
  const category = await categoryRepository.findById(id);

  if (!category) {
    throw ServiceError.notFound(`No category with id ${id} exists`, { id });
  }
  getLogger().info(`found category with id: ${id}`);
  return category;
};

module.exports = { getAll, getById };

