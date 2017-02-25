import React from 'react';
import Masonry from 'react-masonry-component'
// import io from 'socket.io-client';

import Pin from './Pin';

// const socket = io();

const masonryOptions = {
  transitionDuration: 100
}

const user = {
    "_id" : "58b1938d6d8ccf13af902cd6",
    "username" : "Jane",
    "profileImg" : "https://abs.twimg.com/sticky/default_profile_images/default_profile_3_normal.png"
}

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pins: [],
      user: null
    }
  }

  componentWillMount() {
    this.fetchPins();
    this.fetchUser();
  }

  fetchPins() {
    fetch('/api/pins')
    .then(res => res.json())
    .then(json => this.setState({
      pins: json
    }))
  }

  fetchUser() {
    fetch('/api/users', {
      credentials: 'include',
      headers: {
        'x-test-user': JSON.stringify(user)
      }
    })
    .then(res => res.json())
    .then(json => this.setState({
      user: json
    }))
  }

  render() {
    console.log('state', this.state);
    const props = {};
    const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, props));

    function parsePins(pins, user) {
      console.log('parsing');
      return pins.map((pin, i) => (
        <Pin
          key={i}
          imageUrl={pin.imageUrl}
          caption={pin.caption}
          creatorImg={pin._creator.profileImg}
          creator={pin._creator.username}
          liked={pin.likedBy.length}
          likedByMe={user && ~pin.likedBy.indexOf(user._id)}
        />
      )
    )
  }

    return (
      <div className="app__container">
        <Masonry options={masonryOptions}>
          {parsePins(this.state.pins, this.state.user)}
        </Masonry>
      </div>
    )
  }
}
