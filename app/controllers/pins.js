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
  if (!req.user) return res.status(401).send();
  // console.log('deleting pin...', req.params.id);
  const pinId = req.params.id;
  const username = req.user;
  // let updCreator, pinInd;
  Creator.findOne({username})
  .then(creator => {
    // console.log(creator);
    const pinInd = creator.pins.indexOf(pinId);
    if (!~pinInd) throw 400;
    // updCreator = creator;
    creator.pins.splice(pinInd, 1);
    return Promise.all([
      Pin.findByIdAndRemove(pinId),
      creator.save()
    ]);
  })
  .then(() => {
    res.send();
  })
  .catch(e => {
    // console.log(e);
    res.status(400).send()
  })
  // res.send(`pin ${req.params.id} deleted`)
}

module.exports = {
  getPins,
  addPin,
  deletePin
};
