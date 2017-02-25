import React from 'react';

const LikeIcon = (props) => {
  let classes = 'fa fa-heart like-icon__like--icon-'
  classes += props.full ? 'full' : 'empty';
  return (
    <div className="like-icon__like">
      <i className={classes}/> &times; {props.liked}
      {/* <i className={classes}/> &times; 1000 */}
    </div>
  )
}

export default LikeIcon;
