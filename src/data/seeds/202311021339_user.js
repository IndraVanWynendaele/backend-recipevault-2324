const { tables } = require('..');
const Role = require('../../core/roles');

module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex(tables.user).delete(); 
    
    // then add the fresh users
    await knex(tables.user).insert([
      { 
        userId: 1, 
        username: 'pindrois', 
        email: 'indra.vanwynendaele@gmail.com',
        password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.USER, Role.ADMIN]),
      },
      { 
        userId: 2, 
        username: 'test2',
        email: 'pieter.vanderhelst@hogent.be',
        password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.USER]),
      },
      { 
        userId: 3, 
        username: 'test3',
        email: 'karine.samyn@hogent.be',
        password_hash: '$argon2id$v=19$m=131072,t=6,p=1$9AMcua9h7va8aUQSEgH/TA$TUFuJ6VPngyGThMBVo3ONOZ5xYfee9J1eNMcA5bSpq4',
        roles: JSON.stringify([Role.USER]),
      },
    ]);
  },
};