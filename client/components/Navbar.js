import React from 'react';
import { Link } from 'react-router';

export default class Navbar extends React.Component {
  render() {
    const { user, showAllPins, showMyPins } = this.props;
    // console.log('navbar, user', user);
    return (
      <div className="navbar__container">
        <ul className="navbar">
          <li>
            {user && <span onClick={showAllPins}>All Pins</span>}
          </li>
          <li>
            {user && <span onClick={showMyPins}>My Pins</span>}
          </li>
          <li>
            {user ? <a href="/auth/logout"><i className="fa fa-power-off"/></a> : <a href="/auth/twitter">Login</a>}
          </li>
        </ul>
      </div>
    )
  }
}
