const { join } = require('node:path');

const knex = require('knex');
const config = require('config');

const { getLogger } = require('../core/logging'); 


const NODE_ENV = config.get('env');
const isDevelopment = NODE_ENV === 'development';

const DATABASE_CLIENT = config.get('database.client');
const DATABASE_NAME = config.get('database.name');
const DATABASE_HOST = config.get('database.host');
const DATABASE_PORT = config.get('database.port');
const DATABASE_USERNAME = config.get('database.username');
const DATABASE_PASSWORD = config.get('database.password');

let knexInstance;

async function initializeData() {
  const logger = getLogger(); 
  logger.info('Initializing connection to the database'); 


  const knexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: isDevelopment,
    },
    debug: isDevelopment ? (query) => logger.debug(query) : false,
    migrations: {
      tableName : 'knex_meta', // bijhouden welke migraties al uitgevoerd zijn
      directory: join('src', 'data', 'migrations'),
    },
    seeds: {
      directory: join('src', 'data', 'seeds'),
    },
  };

  knexInstance = knex(knexOptions); 

  
  try {
    await knexInstance.raw('SELECT 1+1 AS result'); // connectiecheck
    await knexInstance.raw('CREATE DATABASE IF NOT EXISTS ??', DATABASE_NAME); // database aanmaken (param database_name) en niet gwn + zodat geen sql injection

    await knexInstance.destroy(); // connectie sluiten

    knexOptions.connection.database = DATABASE_NAME; // database naam toevoegen aan de connectie
    knexInstance = knex(knexOptions); // nieuwe connectie maken
  } catch (error) {
    logger.error(error.message, { error });
    throw new Error('Could not initialize the data layer'); 
  }
  
  try {
    await knexInstance.migrate.latest(); // bijwerken naar de laatste versie
  } catch (error) {
    logger.error(error.message, { error });
    throw new Error('Migrations failed, check the logs');
  }

  if (isDevelopment) {
    try {
      await knexInstance.seed.run(); // seeden van de database
    } catch (error) {
      logger.error('Error while seeding database', { error });
    }
  }
  
  logger.info('Connection to the database has been established');

  return knexInstance; 
}

function getKnex() {
  if (!knexInstance)
    throw new Error(
      'Please initialize the data layer before getting the Knex instance',
    );
  return knexInstance;
}

async function shutdownData() {
  const logger = getLogger();
  logger.info('Shutting down connection to the database');
  await knexInstance.destroy();
  knexInstance = null;
  logger.info('Connection to the database has been closed');
}

const tables = Object.freeze({
  recipe: 'recipe',
  category: 'category',
  ingredient: 'ingredient',
  user: 'user',
  userLikedRecipe: 'userLikedRecipe',
  difficulty: 'difficulty',
});

module.exports = {
  initializeData,
  getKnex, 
  tables, 
  shutdownData,
};
