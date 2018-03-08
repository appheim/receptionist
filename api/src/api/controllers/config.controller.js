/**
 * Created by Vadym Yatsyuk on 07.03.18
 */

const httpStatus = require('http-status');

const Company = require('../models/company.model');
const User = require('../models/user.model');
const Config = require('../models/config.model');

exports.get = async (req, res, next) => {
  try {
    const companyId = req.locals.company._id;
    let config = await Config.findOne({ companyId });

    if (!config) {
      res.status(httpStatus.NOT_FOUND).end();
      return;
    }

    res.status(httpStatus.OK)
      .json(config.toObject())
      .end();
  } catch (error) {
    next(error);
  }
};

exports.upsert = async (req, res, next) => {
  try {
    if (!req.locals.company.adminId.equals(req.user._id)) {
      res.status(httpStatus.FORBIDDEN).end();
      return;
    }

    const companyId = req.locals.company._id;
    let config = await Config.findOne({ companyId });
    if (!config) {
      config = new Config({});
    }
    await config.update({ ...req.body, companyId }, { override: true, upsert: true });

    let savedConfig = await Config.findOne({ companyId });

    res.json(savedConfig.toObject()).end();
  } catch (error) {
    next(error);
  }
};