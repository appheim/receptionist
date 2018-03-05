/**
 * Created by Vadym Yatsyuk on 04.03.18
 */
const mongoose = require('mongoose');

const APIError = require('../utils/APIError');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  users: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true,
});

/**
 * Methods
 */
companySchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'name', 'adminId', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   *
   * @param {string} id
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  listUsers({ id, limit = 10 }) {
    return this.populate({
        path: 'users',
        select: 'name',
      })
      // .limit(limit);
  },
});

/**
 * Statics
 */
companySchema.statics = {
  /**
   * Get company
   *
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let company;

      if (mongoose.Types.ObjectId.isValid(id)) {
        company = await this.findById(id).exec();
      }
      if (company) {
        return company;
      }

      throw new APIError({
        message: 'Company does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  }
};

module.exports = mongoose.model('Company', companySchema);