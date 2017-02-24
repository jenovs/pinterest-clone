const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const CreatorSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  profileImg: String
});

module.exports = mongoose.model('creator', CreatorSchema);
