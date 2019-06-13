const mongoose = require('mongoose');

const { Schema } = mongoose;

const jobSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = mongoose.model('Job', jobSchema);