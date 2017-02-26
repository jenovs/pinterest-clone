const router = require('express').Router();

const { getPins, addPin, deletePin, toggleLike } = require('./pin.actions');

let checkAuth;

if (process.env.NODE_ENV === 'test') {
  checkAuth = (req, res, next) => {
    next();
  }
} else {
  checkAuth = (req, res, next) => {
    if (!req.user) return res.status(401).send();
    next();
  }
}

router.get('/', getPins);

router.post('/', checkAuth, addPin);

router.put('/:id', checkAuth, toggleLike);

router.delete('/:id', checkAuth, deletePin);

module.exports = router;
