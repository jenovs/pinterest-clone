import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

export default class NotFound404 extends React.Component {
  componentWillMount() {
    browserHistory.push('/');
  }
  render() {
    return (
      <div>404! Page not found :(</div>
    )
  }
}
