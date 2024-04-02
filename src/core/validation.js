const Joi = require('joi'); 


const JOI_OPTIONS = {
  abortEarly: true, // stoppen bij eerste fout (fail-fast)
  allowUnknown: false, // iets niet gekend -> weigeren
  context: true, // Joi.ref kunnen gebruiken (bvb vgl)
  convert: true, // invoer omzetten naar het gevraagde (Number, Date, ... )
  presence: 'required', // alles standaard verplicht
};

const cleanupJoiError = (error) =>
  error.details.reduce((resultObj, { message, path, type }) => { 
    const joinedPath = path.join('.') || 'value'; 
      
    if (!resultObj[joinedPath]) {
      resultObj[joinedPath] = [];
    }
    resultObj[joinedPath].push({
      type,
      message,
    });
  
    return resultObj; 
  }, {});
  

// functie die middleware maakt
const validate = (schema) => {
  
  if (!schema) {
    schema = {
      query: {},
      body: {},
      params: {},
    };
  }

  
  return (ctx, next) => {
    const errors = {}; // ebvat alle fouten per categorie

    // als bij validationScheme geen params staat, maak er dan een leeg object van 
    // (zorgt er ook voor dat we Joi.object niet altijd moeten gebruiken)   
    if (!Joi.isSchema(schema.params)) {
      schema.params = Joi.object(schema.params || {});
    }

    const { error: paramsError, value: paramsValue } = schema.params.validate(
      ctx.params,
      JOI_OPTIONS, 
    );

    if (paramsError) {
      errors.params = cleanupJoiError(paramsError);
    } else {
      ctx.params = paramsValue;
    }


    if (!Joi.isSchema(schema.body)) {
      schema.body = Joi.object(schema.body || {});
    }
      
    const { error: bodyError, value: bodyValue } = schema.body.validate(
      ctx.request.body,
      JOI_OPTIONS,
    );
    
    if (bodyError) {
      errors.body = cleanupJoiError(bodyError);
    } else {
      ctx.request.body = bodyValue;
    }

    if (!Joi.isSchema(schema.query)) {
      schema.query = Joi.object(schema.query || {});
    }
      
    const { error: queryError, value: queryValue } = schema.query.validate(
      ctx.request.query,
      JOI_OPTIONS,
    );
      
    if (queryError) {
      errors.query = cleanupJoiError(queryError);
    } else {
      ctx.request.query = queryValue;
    }
      

    if (Object.keys(errors).length) {
      ctx.throw(400, 'Validation failed, check details for more information', {
        code: 'VALIDATION_FAILED',
        details: errors,
      });
    }

    return next(); 
  };
};
module.exports = validate; 
