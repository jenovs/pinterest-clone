const fetch = require('node-fetch');

function emitUpdate(req) {
  const io = req.app.get('socketio');
  io.emit('update');
}

function validateImageUrl(url) {
  return fetch(url)
  .then(res => {
    return !!~res.headers._headers['content-type'][0].indexOf('image')
  })
  .catch(e => console.log(e))
}

module.exports = {
  emitUpdate,
  validateImageUrl
}
