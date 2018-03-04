/**
 * Created by Vadym Yatsyuk on 04.03.18
 */
const express = require('express');
const validate = require('express-validation');
const router = express.Router();

const controller = require('../../controllers/company.controller');
const { authorize, ADMIN, LOGGED_USER } = require('../../middlewares/auth');
const { createCompany } = require('../../validations/company.validation');

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
  .post(authorize(LOGGED_USER), validate(createCompany), controller.create);

module.exports = router;
