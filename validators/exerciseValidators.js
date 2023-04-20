const Joi = require('joi');

function validateExercise(exercise) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    public: Joi.boolean(),
  });
  return schema.validate(exercise);
}

function validateDeleteReq(exercise) {
  const schema = Joi.object({
    id: Joi.objectId().required(),
  });
  return schema.validate(exercise);
}

function validateUpdateReq(exercise) {
  const schema = Joi.object({
    id: Joi.objectId().required(),
    name: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(exercise);
}

exports.validateExercise = validateExercise;
exports.validateDeleteReq = validateDeleteReq;
exports.validateUpdateReq = validateUpdateReq;
