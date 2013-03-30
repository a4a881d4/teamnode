var redis = require('./redisclient')
  , client = redis.client
  ;

exports.set = function set(k,v,cb) {
  client.set(k,JSON.stringify(v),cb);
};

exports.get = function get(k,cb) {
  client.get(k,function(err,value) {
    if(err) {
      console.log('redis get '+k+' error: '+err);
      cb(err,null);
    } else
      cb(null,JSON.parse(value));
    });
};

exports.del = function del(k,cb) {
  client.del(k,cb);
};

exports.getByPrefix = function getByPrefix( prefix, cb ) {
  var ret = [];
  client.keys(prefix+'*',function(err,replies) {
    if(err) {
      console.log('redis get prefix key error: '+err);
      cb(err,null);
    }else {
      var count=0;
      replies.forEach( function (reply, i) {
        client.get( reply, function(error,value) {
          if(err) {
            console.log('redis get '+reply+' error: '+err);
            cb(err,null);
          } else {
            count++;
            if( value ) {
              ret.push(JSON.parse(value));
            }
            if( count==replies.length )
              cb(null,ret);
          }
        });
      });
    }
  });
};
exports.quit = function quit() {
  client.quit(function (err, res) {
    console.log("Exiting from quit command.");
  });
};
