require('./../config/config');

const mongoose = require('mongoose');

const {
  MONGODB_URI
} = process.env;

mongoose.Promise = global.Promise;
mongoose.connect(MONGODB_URI);

module.exports = mongoose;
