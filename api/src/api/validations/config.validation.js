/**
 * Created by Vadym Yatsyuk on 07.03.18
 */
const Joi = require('joi');
const Config = require('../models/config.model');

module.exports = {
  upsert: {
    body: {
      fields: Joi.array(),
      nda: Joi.boolean()
    }
  }
};