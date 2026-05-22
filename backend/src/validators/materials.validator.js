const Joi = require('joi');

const createMaterialSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  description: Joi.string().max(1000).allow(''),
  subject: Joi.string().valid('math', 'physics').required(),
  topic: Joi.string().max(200).allow(''),
  gradeLevel: Joi.array().items(Joi.number().integer().min(7).max(12)),
  fileType: Joi.string().valid('pdf', 'image', 'link').required(),
  fileUrl: Joi.when('fileType', { is: 'link', then: Joi.string().uri().required(), otherwise: Joi.forbidden() }),
});

const updateMaterialSchema = Joi.object({
  title: Joi.string().min(2).max(200),
  description: Joi.string().max(1000).allow(''),
  subject: Joi.string().valid('math', 'physics'),
  topic: Joi.string().max(200).allow(''),
  gradeLevel: Joi.array().items(Joi.number().integer().min(7).max(12)),
  isActive: Joi.boolean(),
});

module.exports = { createMaterialSchema, updateMaterialSchema };
