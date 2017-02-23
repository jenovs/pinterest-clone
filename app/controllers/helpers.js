function emitUpdate(req) {
  const io = req.app.get('socketio');
  io.emit('update');
}

module.exports = {
  emitUpdate
}
