const Pin = require('./pin.model');
const { emitUpdate, validateImageUrl } = require('./../helpers');

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
  let { caption, imageUrl } = req.body
  if (!caption || !imageUrl) return res.status(400).send();
  const username = req.user.username;
  validateImageUrl(imageUrl)
  .then(valid => {
    imageUrl = valid ? imageUrl : '/img/placeholder.png'
  })
  .then(() => {
    const newPin = new Pin({
      imageUrl,
      caption,
      _creator: req.user._id
    });
    Promise.resolve(newPin.save())
  })
  .then(() => {
    res.send();
    emitUpdate(req);
  })
  .catch(e => {
    console.log(e);
    res.status(400).send()
  });
}

function deletePin(req, res) {
  if (!req.user) return res.status(401).send();

  Pin.findOneAndRemove({
    _id: req.params.id,
    _creator: req.user._id
  })
  .then((data) => {
    if (!data) throw 400;
    res.send();
    emitUpdate(req);
  })
  .catch(e => {
    // console.log(e);
    res.status(400).send()
  })
}

function toggleLike(req, res) {
  if (!req.user) return res.status(401).send();

  Pin.findById(req.params.id)
  .then(pin => {
    const likedId = pin.likedBy.indexOf(req.user._id)
    if (!~likedId) pin.likedBy.push(req.user._id);
    else pin.likedBy.splice(likedId, 1);
    return pin.save();
  })
  .then(() => {
    res.send();
    emitUpdate(req);
  })
  .catch(e => {
    console.log(e);
    res.status(400).send();
  })
}

module.exports = {
  getPins,
  addPin,
  deletePin,
  toggleLike
};
