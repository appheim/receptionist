/**
 * Created by Vadym Yatsyuk on 04.03.18
 */
const express = require('express');
const validate = require('express-validation');
const router = express.Router();

const controller = require('../../controllers/company.controller');
const configController = require('../../controllers/config.controller');
const visitorController = require('../../controllers/visitor.controller');

const { authorize, AUTHORIZED } = require('../../middlewares/auth');
const {
  createCompany,
  addUser,
  listUsers
} = require('../../validations/company.validation');
const {
  upsert
} = require('../../validations/config.validation');

router.param('companyId', controller.load);

router
  .route('/')
  /**
   * @api {post} v1/companies Create Company
   * @apiDescription Create a company
   * @apiVersion 1.0.0
   * @apiName CreateCompany
   * @apiGroup Company
   * @apiPermission user
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String{1..128}}     name  Company name
   *
   * @apiSuccess (Created 201) {String}  name       Company name
   * @apiSuccess (Created 201) {String}  adminId    Company admin id
   * @apiSuccess (Created 201) {Date}    createdAt  Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(authorize(AUTHORIZED), validate(createCompany), controller.create);


router
  .route('/:companyId/users')
  /**
   * @api {post} v1/companies/:companyId/users Add user
   * @apiDescription Add user to the company
   * @apiVersion 1.0.0
   * @apiName AddUser
   * @apiGroup Company
   * @apiPermission user
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {String}  email      User's email
   */
  .post(authorize(AUTHORIZED), validate(addUser), controller.addUser)

  /**
   * @api {post} v1/companies/:companyId/users Get users
   * @apiDescription Get company users
   * @apiVersion 1.0.0
   * @apiName GetUsers
   * @apiGroup Company
   * @apiPermission user
   *
   * @apiHeader {String} Athorization  User's access token
   *
   *
   * @apiParam {String} [search]  Query string param. String to search in user name
   * @apiParam {Number} [limit]  Query string param. limit number of users
   *
   * @apiSuccess {Object[]} users       List of users
   * @apiSuccess {String}   users._id   User id
   * @apiSuccess {String}   users.name  User's name
   *
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .get(authorize(AUTHORIZED), validate(listUsers), controller.listUsers);

router
  .route('/:companyId/configs')
  /**
   * @api {get} v1/companies/:companyId/configs Get config
   * @apiDescription Get company config
   * @apiVersion 1.0.0
   * @apiName GetConfig
   * @apiGroup Company
   * @apiPermission user
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiSuccess {String}   companyId    Company id
   * @apiSuccess {String}   nda          nda
   * @apiSuccess {Object}   fields       fields
   *
   * @apiError (Unauthorized 401)   Unauthorized     Only authenticated users can create the data
   * @apiError (Not Found 404)      NotFound         Config does not exist
   */
  .get(authorize(AUTHORIZED), validate(upsert), configController.get)
  /**
   * @api {put} v1/companies/:companyId/configs Update config
   * @apiDescription Update company config
   * @apiVersion 1.0.0
   * @apiName UpdateConfig
   * @apiGroup Company
   * @apiPermission company admin
   *
   * @apiHeader {String} Athorization  User's access token
   *
   * @apiParam  {[Object]}      [fields]      List of fields
   * @apiParam  {Boolean}       [nda]         Flag to show NDA
   *
   * @apiError (Unauthorized 401)   Unauthorized      Only authenticated users can create the data
   * @apiError (Forbidden 403)      Forbidden         Only company admin can modify the config
   */
  .put(authorize(AUTHORIZED), configController.upsert);

router
  .route('/:companyId/visitors')
  .post(authorize(AUTHORIZED), visitorController.create);

module.exports = router;
