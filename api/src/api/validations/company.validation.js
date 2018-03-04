/**
 * Created by Vadym Yatsyuk on 04.03.18
 */
const Joi = require('joi');
const Company = require('../models/company.model');

module.exports = {
  createCompany: {
    body: {
      name: Joi.string().min(1).max(128).required(),
    }
  }
};