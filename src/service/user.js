const { getLogger } = require('../core/logging');
const userRepository = require('../repository/user');
const ServiceError = require('../core/serviceError');
const { hashPassword } = require('../core/password');
const Role = require('../core/roles');
const { verifyPassword } = require('../core/password');
const { generateJWT, verifyJWT } = require('../core/jwt');
 
const handleDBError = require('./_handleDBError');

const makeExposedUser = ({ userId, username, email, roles }) => ({
  userId,
  username,
  email,
  roles,
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user); 
  return {
    user: makeExposedUser(user),
    token,
  }; 
};

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized('You need to be signed in');
  } 

  if (!authHeader.startsWith('Bearer ')) {
    throw ServiceError.unauthorized('Invalid authentication token');
  }

  const authToken = authHeader.substring(7);
  try {
    const { roles, userId } = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };
  } catch (error) {
    getLogger().error(error.message, { error });
    throw ServiceError.unauthorized(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles.includes(role);

  if (!hasPermission) {
    throw ServiceError.forbidden(
      'You are not allowed to view this part of the application',
    );
  }
};

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email); 
  
  if (!user) {
    // DO NOT expose we don't know the user
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }
  
  const passwordValid = await verifyPassword(password, user.password_hash); 
  
  if (!passwordValid) {
    // DO NOT expose we know the user but an invalid password was given
    throw ServiceError.unauthorized(
      'The given email and password do not match',
    );
  }
  
  getLogger().info(`user ${user.userId} logged in`);
  return await makeLoginData(user);
};

const getAll = async () => {
  const items = await userRepository.findAll();
  getLogger().info('found all users');
  return {
    items: items.map(makeExposedUser),
    count: items.length,
  };
};

const getById = async (id) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw ServiceError.notFound(`No user with id ${id} exists`, { id });
  }
  getLogger().info(`found user with id: ${id}`);
  return makeExposedUser(user);
};

const create = async ({username, email, password}) => {
  try {
    const passwordHash = await hashPassword(password);

    const id = await userRepository.create({
      username,
      email,
      passwordHash,
      roles: [Role.USER],
    });
    const user = await userRepository.findById(id);
    getLogger().info(`created user with id: ${id}`);
    return await makeLoginData(user);
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async (id) => {
  try {
    const deleted = await userRepository.deleteById(id);
    if (!deleted) {
      throw ServiceError.notFound(`No user with id ${id} exists`, { id });
    }
    getLogger().info(`deleted user with id: ${id}`);
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = { getAll, getById, create, deleteById, login, checkAndParseSession, checkRole };