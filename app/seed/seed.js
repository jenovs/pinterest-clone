const { ObjectID } = require('mongodb');
const mongoose = require('./../mongoose');
const Pin = require('./../pins/pin.model');
const Creator = require('./../creators/creator.model');

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
    profileImg: 'Link to img'
  }, {
    _id: creator1Id,
    username: 'John',
    profileImg: 'Link to img'
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
    _creator: creator1Id,
    likedBy: [creator0Id]
  }
];

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
