const Joi = require('joi');

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    isAdmin: Joi.boolean(),
  });
  return schema.validate(user);
}

function validateUsername(username) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    username: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(username);
}

function validateEmail(email) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    new_email: Joi.string().min(5).max(255).required().email(),
  });
  return schema.validate(email);
}

function validatePassword(passowrd) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    old_passowrd: Joi.string().min(5).max(50).required(),
    new_passowrd: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(passowrd);
}

function authorizeUser(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
}

exports.validateUser = validateUser;
exports.validateUsername = validateUsername;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.authorizeUser = authorizeUser;
