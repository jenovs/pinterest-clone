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
  if (!req.user) return res.status(401).send();
  const { caption, imageUrl } = req.body
  if (!caption || !imageUrl) return res.status(400).send();
  const username = req.user;
  let updCreator;
  const newPin = new Pin({
    imageUrl,
    caption
  });

  Creator.findOne({username})
  .then(creator => {
    updCreator = creator;
    newPin._creator = updCreator._id;
    updCreator.pins.push(newPin);
    return Promise.all([updCreator.save(), newPin.save()])
  })
  .then(() => {
    res.send();
  })
  .catch(e => {
    console.log(e);
    res.status(400).send()
  });
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
