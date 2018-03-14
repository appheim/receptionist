/**
 * Created by Vadym Yatsyuk on 13.03.18
 */

const httpStatus = require('http-status');

const Visitor = require('../models/visitor.model');

const Config = require('../models/config.model');

exports.create = async (req, res, next) => {
  try {
    const config = await Config.findOne({ companyId: req.locals.company._id });
    let visitor = {
      companyId: req.locals.company._id,
      fields: []
    };

    if (!config || config.nda && !req.body.nda) {
      res.status(httpStatus.BAD_REQUEST).end();
      return;
    }

    if (config.fields) {
      const hasRequired = config.fields.some(field => {
        return field.required;
      });

      if (hasRequired && (!req.body.fields || !req.body.fields.length)) {
        res.status(httpStatus.BAD_REQUEST).end();
        return;
      }

      if (req.body.fields && req.body.fields.length) {
        const fields = {};
        req.body.fields.forEach(field => {
          fields[field._id] = field;
        });

        for (let field of config.fields) {
          if (field.required && !fields[field._id]) {
            res.status(httpStatus.BAD_REQUEST).end();
            return;
          }

          visitor.fields.push({
            id: field._id,
            value: fields[field._id].value
          });
        }
      }
    }

    await Visitor(visitor).save();
    res.status(httpStatus.OK).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};
