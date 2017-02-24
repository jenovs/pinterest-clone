const Pin = require('./../models/pin');
const Creator = require('./../models/creator');
const { emitUpdate } = require('./helpers');

function getPins (req, res) {
  Pin.find()
  .sort('_id')
  .populate('_creator')
  .then(pins => {
    res.send(pins);
  })
  .catch(e => {
    console.log(e)
    res.status(400).send();
  });
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
