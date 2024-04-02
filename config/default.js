// wordt als eerste gelezen
module.exports = {
  port: 9000,
  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6, // aantal iterations
      memoryCost: 2**17, // hvl geheugen algo mag gebruiken
    },
    jwt: {
      secret: 'rtrytfuygihoipuoiuyeztqefwcnbnnkiyoiukyedhfxvnbnjhiotr',
      expirationInterval: 60 * 60 * 1000, // ms (1 hour)
      issuer: 'budget.hogent.be', // wie heeft token uitgegeven
      audience: 'budget.hogent.be', // wie mag token gebruiken (applicatie)
    },
  },
};