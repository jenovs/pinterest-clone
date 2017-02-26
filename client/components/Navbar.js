import React from 'react';
import { Link } from 'react-router';

export default class Navbar extends React.Component {
  render() {
    const { user } = this.props;
    return (
      <div className="navbar__container">
        <ul className="navbar">
          <li>
            {user && <Link to='/'>All Pins</Link>}
          </li>
          <li>
            {user && <Link to='/mypins'>My Pins</Link>}
          </li>
          {/* <li>
            {user && `@${user.username}`}
          </li> */}
          <li>
            {user ? <a href="/auth/logout"><i className="fa fa-power-off"/></a> : <a href="/auth/twitter">Login</a>}
          </li>
        </ul>
      </div>
    )
  }
}
