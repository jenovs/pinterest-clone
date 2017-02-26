import React from 'react';
import { Link } from 'react-router';

export default class Navbar extends React.Component {
  render() {
    const { user, showMyPins, showUserPins, showAllPins, handleShowMyPins } = this.props;
    let linkActive = 'navbar__link--active';
    let linkInactive = 'navbar__link--inactive';
    
    return (
      <div className="navbar__container">
        <ul className="navbar">
          <li>
            <span className={(showMyPins || showUserPins) ? linkInactive : linkActive} onClick={showAllPins}>All Pins</span>
          </li>
          <li>
            {user && <span className={(showMyPins && !showUserPins) ? linkActive : linkInactive} onClick={handleShowMyPins}>My Pins</span>}
          </li>
          <li>
            {user ? <a href="/auth/logout"><i className="fa fa-power-off"/></a> : <a href="/auth/twitter">Login</a>}
          </li>
        </ul>
      </div>
    )
  }
}
