require('./config/config');

console.log('Process:', process.env.NODE_ENV);

const express = require('express');
const path = require('path');
const fetch = require('node-fetch');
const passport = require('passport');
const TwitterStrategy = require('passport-twitter');
const session = require('express-session');
const mongoose = require('./mongoose');
const bodyParser = require('body-parser');
const books = require('./routes/books');
const users = require('./routes/users');
const trades = require('./routes/trades');

const Book = require('./models/book');
const User = require('./models/user');

const { usersList } = require('./seed/seed');

const {
  PORT,
  TW_API_KEY,
  TW_API_SECRET,
  TW_CALLBACK_URL,
} = process.env;

if (process.env.NODE_ENV !== 'test') {
  passport.use(new TwitterStrategy({
    consumerKey: TW_API_KEY,
    consumerSecret: TW_API_SECRET,
    callbackURL: TW_CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    done(null, profile.username);
  }
));
}

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
app.set('socketio', io);

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'supersecret',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  // console.log('serializeUser', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // console.log('deserializeUser', user);
  done(null, user);
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {failureRedirect: '/fail'}),
  (req, res, next) => {
    // console.log(req.user);
    User.findOne({username: req.user})
    .then(user => {
      if(!user) {
        const newUser = new User({
          username: req.user
        })
        return newUser.save();
      }
    })
    .then(() => {
      res.redirect('/');
    })
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/')
});

// Temp hack to do testing.
// Mock the loggded in user.
if (process.env.NODE_ENV === 'test') {
  app.use((req, res, next) => {
    req.user = req.headers['x-test-user'];
    next();
  });
}

app.use('/api/pins', pins);
app.use('/api/users', users);

// io.on('connection', () => {
//   console.log('user connected');
// })

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});

module.exports = { app };
