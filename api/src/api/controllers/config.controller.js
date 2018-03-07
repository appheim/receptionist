/**
 * Created by Vadym Yatsyuk on 07.03.18
 */

const httpStatus = require('http-status');

const Company = require('../models/company.model');
const User = require('../models/user.model');
const Config = require('../models/config.model');

exports.upsert = async (req, res, next) => {
  try {
    if (!req.locals.company.adminId.equals(req.user._id)) {
      res.status(httpStatus.FORBIDDEN).end();
      return;
    }
    
    res.end();
  } catch (error) {
    next(error);
  }
};