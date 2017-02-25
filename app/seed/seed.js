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
    profileImg: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_3_normal.png'
  }, {
    _id: creator1Id,
    username: 'John',
    profileImg: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_2_normal.png'
  }
];

const pinsList = [
  {
    _id: pin0Id,
    imageUrl: 'http://www.planwallpaper.com/static/images/desktop-year-of-the-tiger-images-wallpaper.jpg',
    _creator: creator0Id,
    caption: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  }, {
    _id: pin1Id,
    imageUrl: 'https://static01.nyt.com/images/2016/11/16/world/16Supermoon2/16Supermoon2-superJumbo.jpg',
    _creator: creator0Id,
    caption: 'Pin number two'
  }, {
    _id: pin2Id,
    imageUrl: 'http://www.gettyimages.com/gi-resources/images/Homepage/Hero/US/Oct2016/VQ_The%20Live-Wire.jpg',
    _creator: creator1Id,
    caption: 'Pin number three'
  }, {
    _id: pin3Id,
    imageUrl: 'https://s-media-cache-ak0.pinimg.com/736x/ff/2e/54/ff2e54f2ca5c09a877fb04d84bc562a4.jpg',
    _creator: creator1Id,
    caption: 'Pin number four',
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
