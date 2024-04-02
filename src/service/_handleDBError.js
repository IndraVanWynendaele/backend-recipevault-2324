const ServiceError = require('../core/serviceError'); 

const handleDBError = (error) => {
  const { code = '', sqlMessage } = error; 


  // in migrations unique
  if (code === 'ER_DUP_ENTRY') {
    switch (true) {
      case sqlMessage.includes('idx_category_name_unique'):
        return ServiceError.validationFailed(
          'A category with this name already exists',
        );
      case sqlMessage.includes('idx_user_username_unique'):
        return ServiceError.validationFailed(
          'There is already a user with this username',
        );
      case sqlMessage.includes('idx_difficulty_name_unique'):
        return ServiceError.validationFailed(
          'A difficulty with this name already exists',
        );
      default:
        return ServiceError.validationFailed('This item already exists');
    }
  }

  // in migrations foreign keys
  if (code.startsWith('ER_NO_REFERENCED_ROW')) {
    switch (true) {
      case sqlMessage.includes('fk_recipe_category'):
        return ServiceError.notFound('This category does not exist');
      case sqlMessage.includes('fk_recipe_difficulty'):
        return ServiceError.notFound('This difficulty does not exist');
      case sqlMessage.includes('fk_recipe_user'):
        return ServiceError.notFound('This user does not exist');
      case sqlMessage.includes('fk_recipe_ingredient'):
        return ServiceError.notFound('This recipe does not exist');
      case sqlMessage.includes('fk_likedRecipe_user'):
        return ServiceError.notFound('This user does not exist');
      case sqlMessage.includes('fk_likedRecipe_recipe'):
        return ServiceError.notFound('This recipe does not exist');        
    }
  }

  // Return error because we don't know what happened
  return error;
};

module.exports = handleDBError; 
