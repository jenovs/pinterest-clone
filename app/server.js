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

const pins = require('./pins/pin.routes');
const users = require('./creators/creator.routes');
const Creator = require('./creators/creator.model');

const { seed, usersList, booksList } = require('./seed/seed');

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
    // console.log(profile._json);
    const d = profile._json;

    const user = new Creator({
      username: d.screen_name,
      profileImg: d.profile_image_url_https
    })

    user.save()
    .then(() => {
      done(null, d.screen_name);
    })
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
  console.log('serializeUser', user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserializeUser', user);
  Creator.findOne({username: user}, '_id username')
  .then(user => {
    console.log('user', user)
    done(null, user);
  })
});

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {failureRedirect: '/fail'}),
  (req, res, next) => {
    console.log('req.user', req.user);
    res.redirect('/');

    // Creator.findOne({username: req.user})
    // .then(user => {
    //   if(!user) {
    //     const newUser = new Creator({
    //       username: req.user
    //     })
    //     return newUser.save();
    //   }
    // })
    // .then(() => {
    //   res.redirect('/');
    // })
  }
);

app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/')
});

// Temp hack to do testing.
// Mock the loggded in user.
if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development_') {
  app.use((req, res, next) => {
    req.user = req.headers['x-test-user'] && JSON.parse(req.headers['x-test-user']);
    // console.log('req.user', req.user);
    next();
  });
}

app.use('/api/pins', pins);
app.use('/api/users', users);

// Seed db
const done = () => {};
app.use('/api/seed', (req, res) => {
  seed(done);
  res.send('Seed OK');
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}...`);
});

module.exports = { app };
