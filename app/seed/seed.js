const { ObjectID } = require('mongodb');
const mongoose = require('./../mongoose');
const Pin = require('./../models/pin');
const Creator = require('./../models/creator');

const creator0Id = new ObjectID();
const creator1Id = new ObjectID();

const pin0Id = new ObjectID();
const pin1Id = new ObjectID();
const pin2Id = new ObjectID();
const pin3Id = new ObjectID();

const creatorsList = [
  {
    _id: creator0Id,
    username: 'Jane',
    pins: []
  }, {
    _id: creator1Id,
    username: 'John',
    pins: []
  }
];

const pinsList = [
  {
    _id: pin0Id,
    imageUrl: 'some fake url',
    _creator: creator0Id
  }, {
    _id: pin1Id,
    imageUrl: 'some fake url',
    _creator: creator0Id
  }, {
    _id: pin2Id,
    imageUrl: 'some fake url',
    _creator: creator1Id
  }, {
    _id: pin3Id,
    imageUrl: 'some fake url',
    _creator: creator1Id
  }
];

// let c = -1;
// creatorsList.forEach(creator => {
//   creator.pins.push(pinsList[++c]._id, pinsList[++c]._id);
// });

function seed(done) {
  const { pins, creators } = mongoose.connection.collections;

  creators.drop(() => {
    pins.drop(() => {
      Promise.all([Creator.insertMany(creatorsList), Pin.insertMany(pinsList)])
      .then((data) => {
        done()
      })
      .catch(e => console.log(e))
    });
  });
}

module.exports = {
  seed,
  creatorsList,
  pinsList
}
