const { getLogger } = require('../core/logging');
const {tables, getKnex} = require('../data/index');

const findAll = async () => {
  getLogger().info('finding all users');
  return await getKnex()(tables.user)
    .select('*');
};

const findCount = async () => {
  getLogger().info('finding count of users');
  const [count] = await getKnex()(tables.user).count();
  return count['count(*)'];
};

const findById = (id) => {
  getLogger().info(`finding user with id: ${id}`);
  return getKnex()(tables.user).where('userId', id).first();
};

const findByEmail = (email) => {
  getLogger().info(`finding user with email: ${email}`);
  return getKnex()(tables.user).where('email', email).first();
};

const create = async ({username, email, passwordHash, roles}) => {
  try {
    getLogger().info(`creating user ${username}`);
    const [id] = await getKnex()(tables.user).insert({
      username,
      email,
      password_hash: passwordHash,
      roles: JSON.stringify(roles),
    });
    return id;
  } catch (error) {
    getLogger().error('error creating user', {error});
    throw error;
  }
};

const deleteById = async (id) => {
  try {
    getLogger().info(`deleting user with id ${id}`);
    const rowsAffected = await getKnex()(tables.user)
      .where('userId', id)
      .delete();
    return rowsAffected > 0;
  } catch (error) {
    getLogger().error('error deleting user', {error});
    throw error;
  }
};

module.exports = { findAll, findCount, findById, findByEmail, create, deleteById};