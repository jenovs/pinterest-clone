import React from 'react';
import io from 'socket.io-client';

import Footer from './Footer';
import Navbar from './Navbar';

const socket = io();

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
      let filteredPins = this.state.filteredPins;

      if (this.state.user) {
        myPins = this.filterByUser(json, this.state.user.username);
      }

      if (this.state.showUserPins) {
        filteredPins = this.filterByUser(json, this.state.showUserPins);
      }

      this.setState({
        myPins,
        filteredPins,
        pins: json
      })
    })
  }

  fetchUser() {
    fetch('/api/users', {
      credentials: 'include'
    })
    .then(res => res.json())
    .then(user => {
      if (!user) throw Error;
      this.setState({
        user
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
    const newPin = {
      imageUrl,
      caption
    }
    fetch('/api/pins', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPin)
    })
  }

  showMyPins() {
    if (!this.state.user) return;
    this.setState({
      showMyPins: true,
      showUserPins: null,
      filteredPins: []
    })
  }

  showAllPins() {
    this.setState({
      showMyPins: false,
      showUserPins: null,
      filteredPins: []
    })
  }

  deletePin(id, username) {
    const { user } = this.state
    if (!user || user.username !== username) return;

    fetch(`/api/pins/${id}`, {
      credentials: 'include',
      method: 'DELETE'
    })
    .catch();
  }

  showUserGallery(username) {
    const { user, pins } = this.state;
    if (user && user.username === username) return this.showMyPins();
    const filteredPins = this.filterByUser(pins, username);

    this.setState({
      filteredPins,
      showUserPins: username
    });
  }

  toggleLike(id) {
    if (!this.state.user) return;

    fetch(`/api/pins/${id}`, {
      credentials: 'include',
      method: 'PUT'
    })
    .catch(e => e);
  }

  render() {
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
          {...this.state}
          handleShowMyPins={this.showMyPins}
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
