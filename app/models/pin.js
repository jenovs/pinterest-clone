const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;

const PinSchema = new Schema({
  imageUrl: String,
  _creator: {
    type: Schema.Types.ObjectId,
    ref: 'creator',
    required: true
  },
  likedBy: {
    type: Schema.Types.ObjectId,
    ref: 'creator'
  }
});

module.exports = mongoose.model('pin', PinSchema);
