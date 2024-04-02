module.exports = {
  log: {
    level: 'silly',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:5173'],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: 'mysql2',
    host: 'localhost',
    port: '3306',
    name:'recipevault_test', // <-- zodat we in andere db werken dan development
    username: 'root',
    password: '',
  },
};
  