/**
 * Created by Vadym Yatsyuk on 10.03.18
 */

const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  fields: [Object],
  nda: Boolean
}, {
  timestamps: true,
});

module.exports = mongoose.model('Visitor', visitorSchema);