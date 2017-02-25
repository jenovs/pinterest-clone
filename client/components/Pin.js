import React from 'react';

import LikeIcon from './LikeIcon';

export default class Pin extends React.Component {
  render() {
    const { caption, imageUrl, creatorImg, liked, likedByMe, creator, myProfile } = this.props;

    console.log('likedByMe', likedByMe);
    return (
      <div className="pin__container">
        <div className="pin__image">
          <img src={imageUrl} />
        </div>
        <div className="pin__caption">{caption}</div>
        <div className="pin__controls">
          <div className="pin__creator" title={`@${creator}`}><img src={creatorImg}/></div>
          {myProfile && <button>Delete</button>}
          <LikeIcon liked={liked} full={likedByMe} profile={myProfile}/>
        </div>
      </div>
    )
  }
}
