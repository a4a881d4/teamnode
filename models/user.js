var mongodb = require('./db')
  , crypto = require('crypto')
  , g = require('../Settings')
  ;
var needRecorded = [ 
    'email'
  , 'password'
  , 'name'
  , 'Uid'
  , 'level'
  , 'pinyin'
  , 'avatar_small'
  , 'avatar_normal'
  , 'timeline'
  , 'settings'
  , 'is_closed'
  , 'mobile'
  , 'tel'
  , 'eid'
  , 'weibo'
  , 'desp'
  , 'groups'
];
  
function User(user) {
  for( k in needRecorded ) {
    var record = needRecorded[k];
    if( user[record] )
      this[record] = user[record];
  }
};

module.exports = User;

User.prototype.newUid = function newUid() {
  var md5 = crypto.createHash('md5');
  md5.update(new Date().toString());
  var uid = md5.update(this.email).digest('hex').toString();
  return uid;
};

User.prototype.toObj = function toObj() {
  var user = {};
  for( k in needRecorded ) {
    var record = needRecorded[k];
    if( this[record] )
      user[record] = this[record];
  }

  if( this.Uid )
    user.Uid = this.Uid;
  else
    user.Uid = this.newUid();
  if( this.level )
    user.level = this.level;
  else
    user.level = 1;  
  return user;
};

User.prototype.save = function save(callback) {
  var user = this.toObj();
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.ensureIndex('Uid', {unique: true});
      collection.insert(user, {safe: true}, function(err, user) {
        mongodb.close();
        callback(err, user);
      });
    });
  });
};

User.getBy = function getBy( some, callback ) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.findOne(some, function(err, doc) {
        mongodb.close();
        if (doc) {
          var user = new User(doc);
          callback(err, user);
        } else {
          callback(err, null);
        }
      });
    });
  });
};

User.get = function get( callback ) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.find(function(err, cursor) {
        if (err) {
          console.log(err);
        } else {
          var user = [];
          cursor.toArray( function( err, items ) {
              if( err ) {
                console.log(err);
              } else {
                for(k in items) {
                  var oneUser = new User(items[k]);
                  user.push(oneUser);
                }
                callback(err, user);
                mongodb.close();
              }
            });
        } 
      });
    });
  });
};

User.getByEmail = function getByEmail(email, callback) {
  User.getBy({email:email},callback);
};

User.delBy = function del(some, callback) {
  mongodb.open(function(err, db) {
    if (err) {
      return callback(err);
    }
    db.collection('users', function(err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);
      }
      collection.remove(some, function(err, doc) {
        mongodb.close();
        callback(err, doc);
      });
    });
  });
};

User.delByEmail = function delByEmail(email, callback) {
  User.delBy({email:email},callback);
};

/**
 * 用户注册
 *
 * 只有管理员才能注册用户
 *
 * @param string name
 * @param string email
 * @param string password
 * @return user array
 */

User.sign_up = function sign_up( user, session, cb ) {
  if( !user.name ) {
    cb({ code:g.errorCode.LR_API_ARGS_ERROR , msg:'INPUT_CHECK_BAD_ARGS,NAME'},null );
    return;
  }
  if( !g.is_email( user.email ) ) {
    cb({ code:g.errorCode.LR_API_ARGS_ERROR , msg:'INPUT_CHECK_BAD_EMAIL'},null );
    return;
  }
  if( !user.password ) {
    cb({ code:g.errorCode.LR_API_ARGS_ERROR , msg:'INPUT_CHECK_BAD_ARGS,PASSWORD'},null );
    return;
  }
  if( session.user.level==9 ) {
    User.getByEmail(user.email,function( err, olduser ) {
      if(!olduser) {
        var md5 = crypto.createHash('md5');
        user.password = md5.update(user.password).digest('base64');
        var nUser = new User(user);
        nUser.save(function(err,retuser) {
          if( err ) {
            console.log('add user error'+err);
          } else {
            cb(null,retuser);
          }
        });
      } else {
        console.log('user is exist');
      }
    });
  }
};


