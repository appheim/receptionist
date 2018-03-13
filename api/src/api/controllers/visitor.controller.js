/**
 * Created by Vadym Yatsyuk on 13.03.18
 */

const httpStatus = require('http-status');

const Config = require('../models/config.model');

exports.create = async (req, res, next) => {
  try {
    const config = await Config.findOne({ companyId: req.locals.company._id });
    if (!config) {
      res.status(httpStatus.BAD_REQUEST).end();
      return;
    }

    res.status(httpStatus.OK).end();
  } catch (error) {
    next(error);
  }
};
