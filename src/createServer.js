const Koa = require('koa');
const config = require('config');
 
const installRest = require('./rest');
const { initializeData, shutdownData } = require('./data');
const { initializeLogger, getLogger } = require('./core/logging');
const installMiddlewares = require('./core/installMiddlewares');
const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

console.log(`log level ${LOG_LEVEL}, logs enabled: ${LOG_DISABLED !== true}`); 

module.exports = async function createServer(){
  initializeLogger({
    level: LOG_LEVEL,
    disabled: LOG_DISABLED,
    defaultMeta: {
      NODE_ENV,
    },
  });
  await initializeData();

  const app = new Koa();

  installMiddlewares(app);

  installRest(app);

  return {
    getApp() {
      return app;
    },

    async start() {
      return new Promise((resolve) => {
        const port = config.get('port');
        app.listen(port, () => {
          getLogger().info(`🚀 Server listening on http://localhost:${port}`);
          resolve();
        });
      });
    },
    async stop() {
      app.removeAllListeners(); // koa listeren afsluiten zodat geen requests meer
      await shutdownData(); // knex connectie afsluiten
      getLogger().info('Server stopped');
    },
  };
};
