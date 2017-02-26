import React from 'react';
import Masonry from 'react-masonry-component'

import Pin from './Pin';

const masonryOptions = {
  transitionDuration: 100
}

export default class Home extends React.Component {

  parsePins() {
    // console.log('parsing', this.props);
    const { user, myPinsOnly, showUserPins } = this.props;
    let pins = this.props.pins;
    if (myPinsOnly) {
      pins = this.props.myPins;
    } else if (showUserPins) {
      pins = this.props.filteredPins
    }
    return pins.map((pin, i) => (
      <Pin
        key={i}
        imageUrl={pin.imageUrl}
        caption={pin.caption}
        creatorImg={pin._creator.profileImg}
        creator={pin._creator.username}
        liked={pin.likedBy.length}
        likedByMe={user && ~pin.likedBy.indexOf(user._id)}
        user={user}
        deletePin={this.props.deletePin.bind(this, pin._id)}
        myPinsOnly={this.props.myPinsOnly}
        showUserGallery={this.props.showUserGallery}
        showUserPins={this.props.showUserPins}
      />
      )
    )
  }

  addPin(e) {
    e.nativeEvent.preventDefault();
    const imageUrl = this.refs.imageUrl.value;
    const caption = this.refs.caption.value;
    if (!imageUrl || !caption) return;
    this.refs.imageUrl.value = '';
    this.refs.caption.value = '';
    this.props.addPin(imageUrl, caption);
  }

  render() {
    // console.log('Home, props', this.props);


    return (
      <div>
        <div>
          {this.props.user && (
            <form onSubmit={this.addPin.bind(this)}>
              <input type="url" name="imageUrl" ref="imageUrl" placeholder="Image URL"/>
              <input type="text" name="caption" ref="caption" placeholder="Caption"/>
              <button type="submit">Add</button>
            </form>
          )}
        </div>
        <div>
          <Masonry options={masonryOptions}>
            {this.parsePins()}
          </Masonry>
        </div>
      </div>
    )
  }
}
