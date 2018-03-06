/**
 * Created by Vadym Yatsyuk on 04.03.18
 */
const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const bcrypt = require('bcryptjs');

const app = require('../../../index');
const User = require('../../models/user.model');
const Company = require('../../models/company.model');

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
      },
    };

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

      let res = request(app)
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
});