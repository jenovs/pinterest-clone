const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const CreatorSchema = new Schema({
  username: {
    type: String,
    unique: true
  },
  profileImg: {
    type: String
  },
  pins: [{
    type: Schema.Types.ObjectId,
    ref: 'pin'
  }],
  iLiked: [{
    type: Schema.Types.ObjectId,
    ref: 'pin'
  }]
});

module.exports = mongoose.model('creator', CreatorSchema);
