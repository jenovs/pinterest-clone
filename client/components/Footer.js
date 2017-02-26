import React from 'react';

export default class Footer extends React.Component {
  render() {
    return (
      <footer>
        <p>Fullstack project for FreeCodeCamp.</p>
        <p>Created using Node, Express, React, MongoDB, Socket.io.</p>
        <a href="https://github.com/jenovs/pinterest-clone"
          target="_blank">Source code on GitHub</a>
      </footer>
    )
  }
}
