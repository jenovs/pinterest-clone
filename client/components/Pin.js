import React from 'react';

import LikeIcon from './LikeIcon';

export default class Pin extends React.Component {

  deletePin() {
    this.props.deletePin(this.props.user.username)
  }

  render() {
    const {
      caption,
      imageUrl,
      creatorImg,
      liked,
      likedByMe,
      creator,
      myPinsOnly,
      user,
      deletePin,
      showUserGallery,
      showUserPins,
      toggleLike
    } = this.props;

    return (
      <div className="pin__container">
        <div className="pin__image">
          <img src={imageUrl} />
        </div>
        <div className="pin__caption">{caption}</div>
        <div className="pin__controls">
          <div className="pin__creator" title={`@${creator}`} onClick={showUserGallery.bind(this, creator)}><img src={creatorImg}/></div>
          {myPinsOnly && <button onClick={this.deletePin.bind(this)}>Delete</button>}
          <LikeIcon
            liked={liked}
            full={likedByMe}
            myPinsOnly={myPinsOnly}
            user={user}
            toggleLike={toggleLike}
          />
        </div>
      </div>
    )
  }
}
