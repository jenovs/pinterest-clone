import React from 'react';
import Masonry from 'react-masonry-component'
// import io from 'socket.io-client';

// const socket = io();

const images = [
  'http://www.planwallpaper.com/static/images/desktop-year-of-the-tiger-images-wallpaper.jpg',
  'https://static01.nyt.com/images/2016/11/16/world/16Supermoon2/16Supermoon2-superJumbo.jpg',
  'http://www.gettyimages.com/gi-resources/images/Homepage/Hero/US/Oct2016/VQ_The%20Live-Wire.jpg',
  'https://s-media-cache-ak0.pinimg.com/736x/ff/2e/54/ff2e54f2ca5c09a877fb04d84bc562a4.jpg',
  'http://www.goodlightscraps.com/content/illusion/illusion-2.jpg'
];

export default class App extends React.Component {

  render() {
    const props = {};
    const childrenWithProps = React.Children.map(this.props.children, (child) => React.cloneElement(child, props));
    return (
      <div className="app__container">
        <Masonry>
          {images.map((image, i) => <div key={i}><img style={{width: 200}} src={image} /></div>)}
        </Masonry>
      </div>
    )
  }
}
