/**
 * Created by Vadym Yatsyuk on 04.03.18
 */
const Joi = require('joi');
const Company = require('../models/company.model');

module.exports = {
  // POST /v1/companies
  createCompany: {
    body: {
      name: Joi.string().min(1).max(128).required(),
    }
  },

  // POST /v1/companies/:companyId/users
  addUser: {
    body: {
      email: Joi.string().email().required()
    },
    params: {
      companyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // GET /v1/companies/:companyId/users
  listUsers: {
    query: {
      limit: Joi.number().min(1).max(100)
    }
  }
};