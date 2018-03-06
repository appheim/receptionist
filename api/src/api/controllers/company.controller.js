/**
 * Created by Vadym Yatsyuk on 04.03.18
 */
const httpStatus = require('http-status');
const mongoose = require('mongoose');

const Company = require('../models/company.model');
const User = require('../models/user.model');

exports.load = async (req, res, next, id) => {
  try {
    const company = await Company.get(id);
    req.locals = { company };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get company
 * @public
 */
exports.get = (req, res) => res.json(req.locals.company.transform());

/**
 * Create company
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.create = async (req, res, next) => {
  try {
    const companyObject = { ...req.body, adminId: req.user._id, users: [req.user._id] };

    const company = new Company(companyObject);
    const savedCompany = await company.save();

    res.status(httpStatus.CREATED);
    res.json(savedCompany.transform());
  } catch (error) {
    next(error);
  }
};

exports.addUser = async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });

  if (!user) {
    // send user invitation
    res.status(httpStatus.NOT_IMPLEMENTED);
    return;
  }

  // add user to the company
  try {
    let { company } = req.locals;
    company.users.push(user);
    await company.save();
    res.status(httpStatus.OK);
    res.end();
  } catch (e) {
    next(e);
  }
};


exports.listUsers = async (req, res, next) => {
  try {
    const users = await Company.listUsers(req.locals.company._id, req.query);

    res.status(httpStatus.OK);
    res.json(users);
  } catch (e) {
    next(e);
  }

};
