var io = require('socket.io')
  ;
  
function Sio(server) {
  this.sio =  io.listen(server);
  this.reg = {};
  init(this);
};

function init(sio) {
  sio.sio.sockets.on('connection', function (socket) {
    socket.on('register',function(msg) {
      if( msg.Uid ) {
        var Uid = msg.Uid;
        sio.reg[Uid]=socket;
        console.log("register form "+Uid);
      }
    });
  });
};

Sio.prototype.send = function send( Uid, channel, data ) {
  if( this.reg[Uid] ) {
    this.reg[Uid].emit(channel,data);
  }
};

module.exports = Sio;
  
