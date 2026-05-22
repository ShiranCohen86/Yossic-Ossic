const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const registerStudentSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  phone: Joi.string().allow(''),
  gradeLevel: Joi.number().integer().min(7).max(12).required(),
  subjects: Joi.array().items(Joi.string().valid('math', 'physics')).min(1).required(),
});

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100),
  phone: Joi.string().allow(''),
  gradeLevel: Joi.number().integer().min(7).max(12),
  subjects: Joi.array().items(Joi.string().valid('math', 'physics')),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = { loginSchema, registerStudentSchema, updateProfileSchema, changePasswordSchema };
