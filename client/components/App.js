import React from 'react';
import Masonry from 'react-masonry-component'
import io from 'socket.io-client';

import Pin from './Pin';

const socket = io();

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

    this.addPin = this.addPin.bind(this);
  }

  componentWillMount() {
    this.fetchPins();
    this.fetchUser();
  }

  componentDidMount() {
    socket.on('update', () => {
      this.fetchPins();
    })
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

  addPin(e) {
    e.nativeEvent.preventDefault();
    const imageUrl = this.refs.imageUrl.value;
    const caption = this.refs.caption.value;
    if (!imageUrl || !caption) return;
    console.log('adding pin', imageUrl, caption);
    const newPin = {
      imageUrl,
      caption
    }
    fetch('/api/pins', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-test-user': JSON.stringify(user)
      },
      body: JSON.stringify(newPin)
    })
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
        <div>
          <form onSubmit={this.addPin}>
            <input type="url" name="imageUrl" ref="imageUrl" placeholder="Image URL"/>
            <input type="text" name="caption" ref="caption" placeholder="Caption"/>
            <button type="submit">Add</button>
          </form>
        </div>
        <Masonry options={masonryOptions}>
          {parsePins(this.state.pins, this.state.user)}
        </Masonry>
      </div>
    )
  }
}
