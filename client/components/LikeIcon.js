import React from 'react';

const LikeIcon = (props) => {
  let iconClass = 'fa fa-heart like-icon__like--icon-'
  iconClass += props.full ? 'full' : 'empty';
  let divClass = 'like-icon__like';
  divClass += props.user ? '' : '--disabled'
  return (
    <div className={divClass}>
      <i className={iconClass}/>{!props.myPinsOnly && ` \xD7 ${props.liked}`}
    </div>
  )
}

export default LikeIcon;
