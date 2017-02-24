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
  const username = req.user.username;
  // let updCreator;
  // console.log(req.user._id);
  const newPin = new Pin({
    imageUrl,
    caption,
    _creator: req.user._id
  });

  Promise.resolve(newPin.save())
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

  Pin.findOneAndRemove({
    _id: req.params.id,
    _creator: req.user._id
  })
  .then((data) => {
    if (!data) throw 400;
    console.log(data);
    res.send();
  })
  .catch(e => {
    // console.log(e);
    res.status(400).send()
  })
}

module.exports = {
  getPins,
  addPin,
  deletePin
};
