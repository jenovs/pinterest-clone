const router = require('express').Router();

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  checkAuth = (req, res, next) => {
    next();
  }
} else {
  checkAuth = (req, res, next) => {
    console.log('checking auth...', req.user);
    if (!req.user) return res.status(401).send();
    next();
  }
}

router.get('/', checkAuth, (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

module.exports = router;
