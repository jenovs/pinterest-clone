import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './components/App';
import Home from './components/Home';

import NotFound404 from './components/NotFound404';

module.exports = (
  <Route path='/' component={App}>
    <IndexRoute component={Home} />
    <Route path='*' component={NotFound404} />
  </Route>
);
