const { shutdownData, getKnex, tables } = require('../src/data'); 

module.exports = async () => {
  // Remove any leftover data
  await getKnex()(tables.userLikedRecipe).delete();
  await getKnex()(tables.ingredient).delete();
  await getKnex()(tables.recipe).delete(); 
  await getKnex()(tables.user).delete(); 

  // Close database connection
  await shutdownData(); 
};
