import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
// import Home from './components/Home';
// import Profile from './components/Profile';
// import Requests from './components/Requests';
// import Settings from './components/Settings';

import NotFound404 from './components/NotFound404';

module.exports = (
  <Route path='/' component={App}>
    {/* <IndexRoute component={Home} />
      <Route path='/profile' component={Profile} />
      <Route path='/requests' component={Requests} />
    <Route path='/settings' component={Settings} /> */}
    <Route path='*' component={NotFound404} />
  </Route>
);
