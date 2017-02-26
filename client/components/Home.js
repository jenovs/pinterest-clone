import React from 'react';
import Masonry from 'react-masonry-component'

import Pin from './Pin';

const masonryOptions = {
  transitionDuration: 100
}

export default class Home extends React.Component {

  render() {
    console.log('Home, props', this.props);

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
          user={user}
        />
      )
    )
  }

    return (
      <div>
        <div>
          {this.props.user && (
            <form onSubmit={this.addPin}>
              <input type="url" name="imageUrl" ref="imageUrl" placeholder="Image URL"/>
              <input type="text" name="caption" ref="caption" placeholder="Caption"/>
              <button type="submit">Add</button>
            </form>
          )}
        </div>
        <div>
          <Masonry options={masonryOptions}>
            {parsePins(this.props.pins, this.props.user)}
          </Masonry>
        </div>
      </div>
    )
  }
}
