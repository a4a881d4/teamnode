var redis = require('./redisclient')
  ;

function Vcounter( name ) {
  this.key = 'VC_'+name;
  this.client = redis.client;
  this.get( function(err,v) {
    if(err) {
      console.log(err);
      this.set(0);
    }
  });
};

module.exports = Vcounter;

Vcounter.prototype.set = function set(v,cb) {
  this.client.set(this.key,v,cb);
};

Vcounter.prototype.get = function get(cb) {
  this.client.get(this.key,cb);
};

Vcounter.prototype.incr = function inc(cb) {
  this.client.incr(this.key,cb);
};

Vcounter.prototype.quit = function quit() {
  this.client.quit(function (err, res) {
    console.log("Exiting from quit command.");
  });
};
