/**
 * Created by Vadym Yatsyuk on 07.03.18
 */

const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  fields: [{
    name: String,
    kind: String,
    required: Boolean
  }],
  nda: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

/**
 * @typedef Config
 */
module.exports = mongoose.model('Config', configSchema);