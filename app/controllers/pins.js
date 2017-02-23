const Pin = require('./../models/pin');
const Creator = require('./../models/creator');
const { emitUpdate } = require('./helpers');

function getPins (req, res) {
  console.log('getting pins...');
  res.send('pins');
}

function addPin (req, res) {
  const {caption, imgUrl} = req.body
  console.log('adding pin...', req.user);
  res.send(`pin with a caption "${caption}" added`)
}

function deletePin (req, res) {
  console.log('deleting pin :( ...');
  res.send(`pin ${req.params.id} deleted`)
}

module.exports = {
  getPins,
  addPin,
  deletePin
};
