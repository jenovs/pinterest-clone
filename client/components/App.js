import React from 'react';
import io from 'socket.io-client';

import Footer from './Footer';
import Navbar from './Navbar';

const socket = io();

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
      myPins: [],
      user: null,
      profile: false
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
    .then(json => {
      this.setState({
        pins: json
      })
    })
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
    .catch(e => e);
  }

  filterMyPins() {

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
    const props = {
      user: this.state.user,
      pins: this.state.pins
    };
    const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, props));



    return (
      <div className="app__container">
        <Navbar user={this.state.user}/>
        <div className="app__content">
          {childrenWithProps}
        </div>
        <Footer />
      </div>
    )
  }
}
