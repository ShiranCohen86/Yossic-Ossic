const Joi = require('joi');

const bookLessonSchema = Joi.object({
  date: Joi.date().iso().min('now').required(),
  startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  subject: Joi.string().valid('math', 'physics').required(),
  topic: Joi.string().max(200).allow(''),
});

const completeSchema = Joi.object({
  notes: Joi.string().max(2000).allow(''),
});

const cancelSchema = Joi.object({
  cancelReason: Joi.string().max(500).allow(''),
});

const rescheduleSchema = Joi.object({
  date: Joi.date().iso().min('now').required(),
  startTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
  endTime: Joi.string().pattern(/^\d{2}:\d{2}$/).required(),
});

module.exports = { bookLessonSchema, completeSchema, cancelSchema, rescheduleSchema };
