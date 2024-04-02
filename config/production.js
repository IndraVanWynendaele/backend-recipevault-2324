module.exports = {
  log: {
    level: 'info',
    disabled: false,
  },
  cors: {
    origins: ['http://localhost:5173', 'https://two324-frontendweb-indravanwynendaele.onrender.com'],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: 'mysql2',
  },
};
  