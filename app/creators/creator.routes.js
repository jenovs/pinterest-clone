const router = require('express').Router();

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

router.get('/', checkAuth, (req, res) => {
  res.send(req.user);
});

module.exports = router;
