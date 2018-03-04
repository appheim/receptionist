/**
 * Created by Vadym Yatsyuk on 04.03.18
 */
const httpStatus = require('http-status');

const Company = require('../models/company.model');
const User = require('../models/user.model');

exports.create = async (req, res, next) => {
  try {
    const company = new Company(Object.assign(req.body, { adminId: req.user._id }));
    const savedCompany = await company.save();

    res.status(httpStatus.CREATED);
    res.json(savedCompany.transform());
  } catch (error) {
    next(error);
  }
};

