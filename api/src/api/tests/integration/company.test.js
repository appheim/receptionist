/**
 * Created by Vadym Yatsyuk on 04.03.18
 */
const omit = require('lodash').omit;

const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const bcrypt = require('bcryptjs');

const app = require('../../../index');
const User = require('../../models/user.model');
const Company = require('../../models/company.model');
const Config = require('../../models/config.model');

describe('Company API', async () => {
  let dbUsers;

  const password = '123456';
  const passwordHashed = await bcrypt.hash(password, 1);

  beforeEach(async () => {
    dbUsers = {
      jonSnow: {
        email: 'jonsnow@gmail.com',
        password: passwordHashed,
        name: 'Jon Snow',
      }
    };

    await Config.remove({});
    await Company.remove({});
    await User.remove({});
    await User.insertMany([dbUsers.jonSnow]);

    dbUsers.jonSnow.password = password;
  });

  describe('POST /v1/companies', async () => {
    it('should create a new company when request is ok', async () => {
      const { user, accessToken } = await User.findAndGenerateToken(dbUsers.jonSnow);
      const company = {
        name: 'Test company'
      };
      return request(app)
        .post('/v1/companies')
        .set('Authorization', `Bearer ${ accessToken }`)
        .send(company)
        .expect(httpStatus.CREATED)
        .then((res) => {
          expect(res.body).to.include(company);

          // set admin
          expect(res.body.adminId).to.equal(user._id.toString());
        });
    })
  });

  describe('POST /v1/companies/:companyId/users', async () => {
    it('should add user to a company', async () => {
      const { user, accessToken } = await User.findAndGenerateToken(dbUsers.jonSnow);

      const company = {
        name: 'Add user company'
      };
      return request(app)
        .post('/v1/companies')
        .set('Authorization', `Bearer ${ accessToken }`)
        .send(company)
        .expect(httpStatus.CREATED)
        .then(async (res) => {
          expect(res.body).to.include(company);

          const user = await (new User({
            email: 'test@test.com',
            password: passwordHashed,
            name: 'Test'
          })).save();

          return request(app)
            .post(`/v1/companies/${ res.body.id }/users`)
            .set('Authorization', `Bearer ${ accessToken }`)
            .send({
              email: user.email
            })
            .expect(httpStatus.OK);
        });
    });
  });

  describe('GET /v1/companies/:companyId/users', async () => {
    it('should get company users', async () => {
      const { user, accessToken } = await User.findAndGenerateToken(dbUsers.jonSnow);
      let res;
      await request(app)
        .post('/v1/companies')
        .set('Authorization', `Bearer ${ accessToken }`)
        .send({ name: 'Get company users' })
        .expect(httpStatus.CREATED)
        .then(_res => {
          res = _res;
        });

      const user1 = await (new User({
        email: 'test1@test.com',
        password: passwordHashed,
        name: 'Test 1'
      })).save();
      const user2 = await (new User({
        email: 'test2@test.com',
        password: passwordHashed,
        name: 'Test 2'
      })).save();

      const company = await Company.findOne({ _id: res.body.id });
      company.users.push(user1._id);
      company.users.push(user2._id);
      await company.save();

      await request(app)
        .get(`/v1/companies/${ res.body.id }/users`)
        .set('Authorization', `Bearer ${ accessToken }`)
        .set('Content-Type', 'application/json')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.deep.include({ _id: user._id.toString(), name: user.name });
          expect(res.body).to.deep.include({ _id: user1._id.toString(), name: user1.name });
          expect(res.body).to.deep.include({ _id: user2._id.toString(), name: user2.name });
        });

      // search
      return request(app)
        .get(`/v1/companies/${ res.body.id }/users?search=test`)
        .set('Authorization', `Bearer ${ accessToken }`)
        .set('Content-Type', 'application/json')
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body.length).to.equal(2);
        });
    });
  });

  describe('PUT /v1/companies/:companyId/configs', async () => {
    it('should not update company config when user is not admin', async () => {
      let res;
      const accessToken = (await User.findAndGenerateToken(dbUsers.jonSnow)).accessToken;
      let aUser2 = {
        email: 'aUser2@gmail.com',
        password: passwordHashed,
        name: 'User Two'
      };

      await User.insertMany([aUser2]);

      aUser2.password = password;

      const accessTokenNotAdmin = (await User.findAndGenerateToken(aUser2)).accessToken;

      await request(app)
        .post('/v1/companies')
        .set('Authorization', `Bearer ${ accessToken }`)
        .send({ name: 'Get company config' })
        .expect(httpStatus.CREATED)
        .then(_res => {
          res = _res;
        });

      return request(app)
        .put(`/v1/companies/${ res.body.id }/configs`)
        .set('Authorization', `Bearer ${ accessTokenNotAdmin }`)
        .set('Content-Type', 'application/json')
        .send({ files: [], nda: false })
        .expect(httpStatus.FORBIDDEN);
    });


    it('should update company config', async () => {
      const { user, accessToken } = await User.findAndGenerateToken(dbUsers.jonSnow);

      const company = await (Company({
        name: 'Update company config',
        adminId: user._id
      })).save();

      let fields = [];
      let nda = false;

      await request(app)
        .put(`/v1/companies/${ company._id }/configs`)
        .set('Authorization', `Bearer ${ accessToken }`)
        .set('Content-Type', 'application/json')
        .send({ fields, nda })
        .expect(httpStatus.OK)
        .then(async () => {
          let config = await Config.findOne({ companyId: company._id });
          expect(config).to.not.be.null;
          expect(config.fields).to.be.deep.equal(fields);
          expect(config.nda).to.be.equal(nda);
        });

      fields = [{
        name: 'name',
        kind: 'text',
        required: true
      }];
      nda = true;

      return request(app)
        .put(`/v1/companies/${ company._id }/configs`)
        .set('Authorization', `Bearer ${ accessToken }`)
        .set('Content-Type', 'application/json')
        .send({ fields, nda })
        .expect(httpStatus.OK)
        .then(async () => {
          let config = await Config.findOne({ companyId: company._id });
          expect(config).to.not.be.null;
          expect(config.fields.map(v => omit(v.toObject(), ['_id']))).to.be.deep.equal(fields);
          expect(config.nda).to.be.equal(nda);
        });
    });
  });

  describe('GET /v1/companies/:companyId/configs', async () => {
    it('should return company config', async () => {
      const { user, accessToken } = await User.findAndGenerateToken(dbUsers.jonSnow);

      const company = await (Company({
        name: 'Get company config',
        adminId: user._id
      })).save();

      const configObject = {
        companyId: company._id,
        fields: [
          {
            name: 'Full name',
            kind: 'text',
            required: true
          },
          {
            name: 'Address',
            kind: 'text',
            required: false
          }
        ],
        nda: true
      };
      await (Config(configObject)).save();
      configObject.companyId = company._id.toString();

      return request(app)
        .get(`/v1/companies/${ company._id }/configs`)
        .set('Authorization', `Bearer ${ accessToken }`)
        .expect(httpStatus.OK)
        .then(res => {
          delete res.body.__v;
          delete res.body._id;
          delete res.body.createdAt;
          delete res.body.updatedAt;
          res.body.fields.forEach((v, i) => {
            delete res.body.fields[i]._id;
          });

          expect(res.body).to.be.deep.equal(configObject);
        });
    });
  });

  describe('POS /v1/companies/:companyId/visitors', async () => {
    let admin;
    let adminAccessToken;
    let aUser2 = {
      email: 'aUser2@gmail.com',
      password: passwordHashed,
      name: 'User Two'
    };
    let accessTokenNotAdmin;
    let company;

    beforeEach(async () => {
      const { user, accessToken } = await User.findAndGenerateToken(dbUsers.jonSnow);
      admin = user;
      adminAccessToken = accessToken;

      await User.insertMany([aUser2]);
      aUser2.password = password;
      accessTokenNotAdmin = (await User.findAndGenerateToken(aUser2)).accessToken;

      company = await (Company({
        name: 'Create visitor',
        adminId: admin._id
      })).save();
    });

    it('should throw error when no config exist', async () => {
      return request(app)
        .post(`/v1/companies/${ company._id }/visitors`)
        .set('Authorization', `Bearer ${ accessTokenNotAdmin }`)
        .expect(httpStatus.BAD_REQUEST);
    });
  });
});