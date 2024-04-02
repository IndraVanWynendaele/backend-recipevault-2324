const userService = require('../service/user');

const { getLogger } = require('./logging');

const requireAuthentication = async (ctx, next) => {
  const { authorization } = ctx.headers;

  const { authToken, ...session } = await userService.checkAndParseSession(
    authorization,
  );

  ctx.state.session = session;
  getLogger().debug(ctx.state.session.userId);
  ctx.state.authToken = authToken;

  return next();
};

const makeRequireRole = (role) => async (ctx, next) => {
  const { roles = [] } = ctx.state.session;

  userService.checkRole(role, roles);
  return next();
};

module.exports = {
  requireAuthentication,
  makeRequireRole,
};