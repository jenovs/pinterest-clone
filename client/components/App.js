import React from 'react';
import io from 'socket.io-client';

import Footer from './Footer';
import Navbar from './Navbar';

const socket = io();

// const user = {
//     "_id" : "58b1938d6d8ccf13af902cd6",
//     "username" : "Jane",
//     "profileImg" : "https://abs.twimg.com/sticky/default_profile_images/default_profile_3_normal.png"
// }

const user = {
    "_id" : "58b1938d6d8ccf13af902cd7",
    "username" : "John",
    "profileImg" : "https://abs.twimg.com/sticky/default_profile_images/default_profile_2_normal.png"
}

export default class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      pins: [],
      myPins: [],
      filteredPins: [],
      user: null,
      showMyPins: false,
      showUserPins: null
    }

    this.addPin = this.addPin.bind(this);
    this.filterByUser = this.filterByUser.bind(this);
    this.showMyPins = this.showMyPins.bind(this);
    this.showAllPins = this.showAllPins.bind(this);
    this.deletePin = this.deletePin.bind(this);
    this.showUserGallery = this.showUserGallery.bind(this);
    this.toggleLike = this.toggleLike.bind(this);
  }

  componentWillMount() {
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
      let myPins = [];

      if (this.state.user) {
        myPins = this.filterByUser(json, this.state.user.username);
      }

      console.log('myPins', myPins);
      this.setState({
        myPins,
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
    .then(json => {
      this.setState({
        user: json
      }, this.fetchPins)
    })
    .catch(e => {
      this.fetchPins();
      console.log(e);
    });
  }

  filterByUser(pins, username) {
    return pins.filter(pin => pin._creator.username === username);
  }

  addPin(imageUrl, caption) {
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

  showMyPins() {
    console.log('showMyPins');
    if (!this.state.user) return;
    this.setState({
      showMyPins: true,
      showUserPins: null,
      filteredPins: []
    })
  }

  showAllPins() {
    console.log('showAllPins');
    this.setState({
      showMyPins: false,
      showUserPins: null,
      filteredPins: []
    })
  }

  deletePin(id, username) {
    console.log('deletePin', id, username);
    const { user } = this.state
    if (!user || user.username !== username) return;

    fetch(`/api/pins/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-test-user': JSON.stringify(user)
      },
      method: 'DELETE',
    })
  }

  showUserGallery(username) {
    console.log('showing user gallery', username);
    const { user, pins } = this.state;
    if (user && user.username === username) return this.showMyPins();
    const filteredPins = this.filterByUser(pins, username);
    console.log(filteredPins);
    this.setState({
      filteredPins,
      showUserPins: username
    })
  }

  toggleLike(id) {
    fetch(`/api/pins/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'x-test-user': JSON.stringify(user)
      },
      method: 'PUT',
    })
  }

  render() {
    console.log('state', this.state);
    const props = {
      user: this.state.user,
      pins: this.state.pins,
      myPins: this.state.myPins,
      filteredPins: this.state.filteredPins,
      myPinsOnly: this.state.showMyPins,
      addPin: this.addPin,
      deletePin: this.deletePin,
      showUserGallery: this.showUserGallery,
      showUserPins: this.state.showUserPins,
      toggleLike: this.toggleLike
    };
    const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, props));

    return (
      <div className="app__container">
        <Navbar
          user={this.state.user}
          showMyPins={this.showMyPins}
          showAllPins={this.showAllPins}
        />
        <div className="app__content">
          {childrenWithProps}
        </div>
        <Footer />
      </div>
    )
  }
}
