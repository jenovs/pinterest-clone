import React from 'react';

const LikeIcon = (props) => {
  let classes = 'fa fa-heart like-icon__like--icon-'
  classes += props.full ? 'full' : 'empty';
  return (
    <div className="like-icon__like">
      <i className={classes}/>{!props.profile && ` \xD7 ${props.liked}`}
    </div>
  )
}

export default LikeIcon;
